from fastapi import APIRouter, HTTPException
from models.booking_models import (
    BookRequest,
    CancelRequest,
    RescheduleRequest
)
from services.google_client import create_event, delete_event, update_event
from services.supabase_client import (
    get_appointment_duration,
    log_call_event,
    find_appointments_by_phone
)

router = APIRouter()


# -------------------------------------------------
# BOOK APPOINTMENT
# -------------------------------------------------
@router.post("/book")
def book(req: BookRequest):
    """
    BOOK A NEW APPOINTMENT
    ----------------------
    Steps:
      1. Look up duration for appointment_type (Supabase)
      2. Create calendar event in Google Calendar
      3. Log booking into call_events table in Supabase
      4. Return event data to caller (Telnyx or frontend)
    """

    # 1. Fetch duration from appointment_types table
    duration = get_appointment_duration(req.appointment_type)
    if not duration:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown appointment type: {req.appointment_type}"
        )

    # 2. Create event in Google Calendar
    event = create_event(
        summary=req.appointment_type,
        start=req.start,
        duration_minutes=duration,
        patient_phone=req.patient_phone,
        patient_name=req.patient_name
    )

    # 3. Log this booking in Supabase
    log_call_event(
        booking_status="booked",
        patient_name=req.patient_name,
        patient_phone=req.patient_phone,
        call_reason=req.appointment_type,
        meta=event
    )

    # 4. Return response back to Telnyx agent/frontend
    return {
        "status": "booked",
        "event_id": event["id"],
        "start": event["start"]["dateTime"],
        "end": event["end"]["dateTime"],
        "duration_minutes": duration,
    }


# -------------------------------------------------
# CANCEL APPOINTMENT
# -------------------------------------------------
@router.post("/cancel")
def cancel(req: CancelRequest):
    """
    CANCEL AN APPOINTMENT
    ----------------------
    Steps:
      1. Delete event from Google Calendar
      2. Log cancellation in Supabase
    """

    delete_event(req.event_id)

    log_call_event(
        booking_status="cancelled",
        call_reason="cancellation",
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
      1. Update Google Calendar event
      2. Log reschedule in Supabase
    """

    updated = update_event(
        event_id=req.event_id,
        new_start=req.new_start,
        duration_minutes=30  # can later improve to fetch original duration
    )

    log_call_event(
        booking_status="rescheduled",
        call_reason="reschedule",
        meta=updated
    )

    return {
        "status": "rescheduled",
        "event_id": updated["id"],
        "start": updated["start"]["dateTime"],
        "end": updated["end"]["dateTime"],
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
