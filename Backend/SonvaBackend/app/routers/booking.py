import os
from app.services.supabase_client import supabase
from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import datetime, timedelta
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
    get_calendar_service,
    parse_iso_datetime
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
# BOOK APPOINTMENT (Instant response for Telnyx)
# -------------------------------------------------
@router.post("/book")
def book(req: BookRequest, background: BackgroundTasks):
    """
    BOOK AN APPOINTMENT (Async via Background Task)
    -----------------------------------------------
    Fast response to Telnyx. Booking is processed in background.
    Steps executed in background:
      1. Convert start time + calculate end time
      2. Check slot availability
      3. Create event in Google Calendar
      4. Log booking in Supabase
    """

    # Queue background processing
    background.add_task(process_booking_task, req)

    # Respond immediately (prevents Telnyx timeout)
    return {
        "status": "queued",
        "message": "Booking request received and is being processed."
    }

def process_booking_task(req: BookRequest):
    """
    Runs the ACTUAL booking logic.
    This is executed outside of the Telnyx request.
    """

    try:
        # Step 1 — Extract and calculate time
        start_dt = req.start
        appointment_duration = get_duration_for_type(req.appointment_type)

        if appointment_duration is None:
            print(f"[ERROR] Unknown appointment type: {req.appointment_type}")
            return
        
        end_dt = calculate_end_time(start_dt.isoformat(), appointment_duration)

        # Step 2 — Check availability
        if not is_time_available(start_dt, end_dt):
            suggested = find_next_available_slot(start_dt, appointment_duration)
            print(f"[BOOKING FAILED] Slot unavailable. Suggested: {suggested}")
            return

        # Step 3 — Create Google Calendar event
        event = create_event(
            summary=req.appointment_type,
            start=start_dt,
            duration_minutes=appointment_duration,
            patient_phone=req.patient_phone,
            patient_name=req.patient_name
        )

        # Step 4 — Log into Supabase
        log_call_event(
            booking_status="booked",
            patient_name=req.patient_name,
            patient_phone=req.patient_phone,
            call_reason=req.appointment_type,
            meta=event
        )

        print(f"[BOOKING SUCCESS] {req.patient_name} → {start_dt}")

    except Exception as e:
        print("[BOOKING ERROR]", e)





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

    # Step 1 - Fetch event BEFORE deleting it
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

    # Step 2 - Remove the event from Google Calendar
    delete_event(req.event_id)

    # Step 3 - Log cancellation in Supabase
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

    # Step 1 - Fetch original event
    event = service.events().get(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=req.event_id
    ).execute()

    # Pull patient details & duration from extended properties
    private = event.get("extendedProperties", {}).get("private", {})
    patient_name = private.get("patient_name")
    patient_phone = private.get("patient_phone")

    # Extract original appointment duration, defaulting to 30 mins - Should remove the "default" later
    original_duration = int(private.get("duration", 30))

    # Step 2 - Update event with SAME duration but new start time
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

    # Step 1 - Fetch EVERY event from the Google Calendar
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

    # Step 2 - Fetch all cancelled event IDs from Supabase
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

    # Step 3 - Only keep events NOT cancelled
    active_events = [
        ev for ev in user_events
        if ev.get("id") not in cancelled_ids
    ]

    # Step 4 - Format data for response
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
