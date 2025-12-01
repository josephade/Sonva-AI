from fastapi import APIRouter, HTTPException
from app.models.booking_models import (
    BookRequest,
    CancelRequest,
    RescheduleRequest
)
from app.services.google_calender import create_event, delete_event, update_event, find_next_available_slot, is_time_available
from app.services.supabase_client import (
    get_appointment_duration,
    log_call_event,
    find_appointments_by_phone,
    get_duration_for_type,
    calculate_end_time
)

router = APIRouter()


# -------------------------------------------------
# BOOK APPOINTMENT
# -------------------------------------------------
@router.post("/book")
def book(req: BookRequest):

    # Convert input time to ISO
    start_dt = req.start
    appointment_duration = get_duration_for_type(req.appointment_type)
    end_dt = calculate_end_time(start_dt, appointment_duration)

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
        end=end_dt,
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
