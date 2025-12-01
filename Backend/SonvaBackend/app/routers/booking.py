import os
from app.services.supabase_client import supabase
from fastapi import APIRouter, HTTPException
from app.models.booking_models import (
    BookRequest,
    CancelRequest,
    RescheduleRequest
)
from app.services.google_calender import create_event, delete_event, update_event, find_next_available_slot, is_time_available, get_calendar_service
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

    # Convert input time to ISO
    start_dt = req.start
    appointment_duration = get_duration_for_type(req.appointment_type)
    end_dt = calculate_end_time(start_dt.isoformat(), appointment_duration)

    # -----------------------------
    # 1. Check if slot is available
    # -----------------------------
    if not is_time_available(start_dt, end_dt):
        # If taken, find the next available slot
        suggested = find_next_available_slot(start_dt, appointment_duration)

        raise HTTPException(
            status_code=409,
            detail={
                "error": "slot_taken",
                "message": "That time slot is already booked.",
                "suggested_time": suggested,
            },
        )

    # -----------------------------
    # 2. Create Google Calendar event
    # -----------------------------
    event = create_event(
        summary=req.appointment_type,
        start=start_dt,
        # end=end_dt,
        duration_minutes=appointment_duration,
        patient_phone=req.patient_phone,
        patient_name=req.patient_name
    )

    # -----------------------------
    # 3. Log into Supabase
    # -----------------------------
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
      1. Fetch event from Google Calendar (to extract patient info)
      2. Delete event
      3. Log cancellation with patient name + phone
    """

    # --- STEP 1: Fetch event BEFORE deleting it ---
    service = get_calendar_service()
    event = service.events().get(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=req.event_id
    ).execute()

    patient_name = event.get("extendedProperties", {}).get("private", {}).get("patient_name")
    patient_phone = event.get("extendedProperties", {}).get("private", {}).get("patient_phone")

    # --- STEP 2: Delete event ---
    delete_event(req.event_id)

    # --- STEP 3: Log cancellation ---
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
    RESCHEDULE AN APPOINTMENT
    --------------------------
    Steps:
      1. Fetch existing event (to get duration + patient info)
      2. Update event to new start time
      3. Log the rescheduled appointment with full details
    """

    service = get_calendar_service()

    # --- STEP 1: Fetch the existing event ---
    event = service.events().get(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=req.event_id
    ).execute()

    # Extract patient info
    private = event.get("extendedProperties", {}).get("private", {})
    patient_name = private.get("patient_name")
    patient_phone = private.get("patient_phone")

    # Extract original duration
    original_duration = int(private.get("duration", 30))  # fallback to 30 if missing

    # --- STEP 2: Update event with SAME duration ---
    updated = update_event(
        event_id=req.event_id,
        new_start=req.new_start,
        duration_minutes=original_duration
    )

    # --- STEP 3: Log the reschedule ---
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
    Fetch active (non-cancelled) appointments for a patient.
    Combines Google Calendar + Supabase cancellation history.
    """

    service = get_calendar_service()

    # --- STEP 1: Fetch ALL GC events that match this phone ---
    events_result = service.events().list(
        calendarId=GOOGLE_CALENDAR_ID,
        singleEvents=True,
        orderBy="startTime"
    ).execute()

    gc_events = events_result.get("items", [])

    # Filter only appointments with matching phone number
    user_events = []
    for ev in gc_events:
        ext = ev.get("extendedProperties", {}).get("private", {})
        if ext.get("patient_phone") == phone:
            user_events.append(ev)

    # --- STEP 2: Fetch cancellations from Supabase ---
    cancelled = (
        supabase.table("call_events")
        .select("meta")
        .eq("booking_status", "cancelled")
        .execute()
        .data
    )

    cancelled_ids = set([
        item["meta"]["event_id"]
        for item in cancelled
        if "meta" in item and item["meta"] and "event_id" in item["meta"]
    ])

    # --- STEP 3: Remove cancelled bookings ---
    active_events = [
        ev for ev in user_events
        if ev.get("id") not in cancelled_ids
    ]

    # --- STEP 4: Format result ---
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

