import os
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
    GET ALL ACTIVE BOOKINGS FOR A GIVEN PHONE NUMBER
    ------------------------------------------------
    Only returns bookings with booking_status = "booked"
    from Supabase.
    """

    appointments = find_appointments_by_phone(phone)

    return {
        "count": len(appointments),
        "appointments": appointments
    }
