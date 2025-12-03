import os
from app.services.supabase_client import supabase
from fastapi import APIRouter, HTTPException
from app.models.booking_models import (
    BookRequest,
    CancelRequest,
    RescheduleRequest
)
from app.services.google_calender import (
    create_event,
    delete_event,
    update_event,
    find_next_available_slot,
    is_time_available,
    get_calendar_service
)
from app.services.supabase_client import (
    get_appointment_duration,
    log_call_event,
    find_appointments_by_phone,
    get_duration_for_type,
    calculate_end_time
)

router = APIRouter()

GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID")


# -------------------------------------------------
# BOOK APPOINTMENT
# -------------------------------------------------
@router.post("/book")
def book(req: BookRequest):
    """
    BOOK AN APPOINTMENT
    --------------------
    Steps:
      1. Convert provided start time and calculate end time based on duration
      2. Check if the chosen time is free
      3. Create the appointment in Google Calendar
      4. Log the booking into Supabase
    """

    # Convert input start time to datetime and calculate end time
    start_dt = req.start
    appointment_duration = get_duration_for_type(req.appointment_type)
    end_dt = calculate_end_time(start_dt.isoformat(), appointment_duration)

    # Step 1 — Check slot availability
    # If slot is taken, suggest the next available open time
    if not is_time_available(start_dt, end_dt):
        suggested = find_next_available_slot(start_dt, appointment_duration)

        raise HTTPException(
            status_code=409,
            detail={
                "error": "slot_taken",
                "message": "That time slot is already booked.",
                "suggested_time": suggested,
            },
        )

    # Step 2 — Create Google Calendar Event
    event = create_event(
        summary=req.appointment_type,
        start=start_dt,
        duration_minutes=appointment_duration,
        patient_phone=req.patient_phone,
        patient_name=req.patient_name
    )

    # Step 3 — Log the booking into Supabase history table
    log_call_event(
        booking_status="booked",
        patient_name=req.patient_name,
        patient_phone=req.patient_phone,
        call_reason=req.appointment_type,
        meta=event
    )

    return {"status": "success", "event": event}



# -------------------------------------------------
# CANCEL APPOINTMENT
# -------------------------------------------------
@router.post("/cancel")
def cancel(req: CancelRequest):
    """
    CANCEL AN APPOINTMENT
    ----------------------
    Steps:
      1. Pull the event from Google Calendar to get patient info
      2. Delete the event from Calendar
      3. Log the cancellation in Supabase
    """

    # Step 1 — Fetch event BEFORE deleting it
    # This ensures we still have patient details for logging
    service = get_calendar_service()
    event = service.events().get(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=req.event_id
    ).execute()

    # Extract patient metadata from custom event fields
    private = event.get("extendedProperties", {}).get("private", {})
    patient_name = private.get("patient_name")
    patient_phone = private.get("patient_phone")

    # Step 2 — Remove the event from Google Calendar
    delete_event(req.event_id)

    # Step 3 — Log cancellation in Supabase
    log_call_event(
        booking_status="cancelled",
        call_reason="cancellation",
        patient_name=patient_name,
        patient_phone=patient_phone,
        meta={"event_id": req.event_id}
    )

    return {"status": "cancelled"}



# -------------------------------------------------
# RESCHEDULE APPOINTMENT
# -------------------------------------------------
@router.post("/reschedule")
def reschedule(req: RescheduleRequest):
    """
    RESCHEDULE APPOINTMENT
    -----------------------
    Steps:
      1. Fetch existing event to extract patient info and duration
      2. Update Google Calendar event to new time
      3. Log the reschedule event in Supabase
    """

    service = get_calendar_service()

    # Step 1 — Fetch original event
    event = service.events().get(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=req.event_id
    ).execute()

    # Pull patient details & duration from extended properties
    private = event.get("extendedProperties", {}).get("private", {})
    patient_name = private.get("patient_name")
    patient_phone = private.get("patient_phone")

    # Extract original appointment duration, defaulting to 30 mins
    original_duration = int(private.get("duration", 30))

    # Step 2 — Update event with SAME duration but new start time
    updated = update_event(
        event_id=req.event_id,
        new_start=req.new_start,
        duration_minutes=original_duration
    )

    # Step 3 — Log the reschedule
    log_call_event(
        booking_status="rescheduled",
        call_reason="reschedule",
        patient_name=patient_name,
        patient_phone=patient_phone,
        meta=updated
    )

    return {
        "status": "rescheduled",
        "event_id": updated["id"],
        "start": updated["start"]["dateTime"],
        "end": updated["end"]["dateTime"],
        "duration_minutes": original_duration
    }



# -------------------------------------------------
# GET BOOKINGS BY PHONE
# -------------------------------------------------
@router.get("/by_phone")
def get_bookings_by_phone(phone: str):
    """
    GET ACTIVE BOOKINGS BY PHONE
    -----------------------------
    Returns all *non-cancelled* Google Calendar events for a specific phone number.

    Logic:
      1. Fetch all Google Calendar events
      2. Filter only those with the matching phone
      3. Fetch all cancellations stored in Supabase
      4. Remove cancelled events from the list
      5. Return clean list of active appointments
    """

    service = get_calendar_service()

    # Step 1 — Fetch EVERY event from the Google Calendar
    events_result = service.events().list(
        calendarId=GOOGLE_CALENDAR_ID,
        singleEvents=True,
        orderBy="startTime"
    ).execute()

    gc_events = events_result.get("items", [])

    # Filter for events that contain this phone number
    user_events = []
    for ev in gc_events:
        ext = ev.get("extendedProperties", {}).get("private", {})
        if ext.get("patient_phone") == phone:
            user_events.append(ev)

    # Step 2 — Fetch all cancelled event IDs from Supabase
    cancelled = (
        supabase.table("call_events")
        .select("meta")
        .eq("booking_status", "cancelled")
        .execute()
        .data
    )

    cancelled_ids = {
        item["meta"]["event_id"]
        for item in cancelled
        if item.get("meta") and item["meta"].get("event_id")
    }

    # Step 3 — Only keep events NOT cancelled
    active_events = [
        ev for ev in user_events
        if ev.get("id") not in cancelled_ids
    ]

    # Step 4 — Format data for response
    formatted = []
    for ev in active_events:
        ext = ev.get("extendedProperties", {}).get("private", {})
        formatted.append({
            "event_id": ev["id"],
            "summary": ev.get("summary"),
            "start": ev["start"]["dateTime"],
            "end": ev["end"]["dateTime"],
            "patient_name": ext.get("patient_name"),
            "patient_phone": ext.get("patient_phone")
        })

    return {
        "count": len(formatted),
        "appointments": formatted
    }
