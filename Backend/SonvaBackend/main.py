from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from google_client import create_event, delete_event, update_event
from supabase_client import get_appointment_duration, log_call_event, find_appointments_by_phone
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Request Models
# -----------------------------

class BookRequest(BaseModel):
    appointment_type: str
    start: datetime
    patient_phone: str
    patient_name: Optional[str] = None


class CancelRequest(BaseModel):
    event_id: str


class RescheduleRequest(BaseModel):
    event_id: str
    new_start: datetime


# -----------------------------
# Routes
# -----------------------------

@app.get("/")
def health():
    return {"status": "ok", "service": "Sonva AI backend running"}


@app.post("/book")
def book(req: BookRequest):
    duration = get_appointment_duration(req.appointment_type)
    if not duration:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown appointment type: {req.appointment_type}"
        )

    event = create_event(
        summary=req.appointment_type,
        start=req.start,
        duration_minutes=duration,
        patient_phone=req.patient_phone,
        patient_name=req.patient_name
    )

    log_call_event(
        booking_status="booked",
        patient_name=req.patient_name,
        patient_phone=req.patient_phone,
        call_reason=req.appointment_type,
        meta=event,
    )

    return {
        "status": "booked",
        "event_id": event["id"],
        "start": event["start"]["dateTime"],
        "end": event["end"]["dateTime"],
        "duration_minutes": duration,
    }


@app.post("/cancel")
def cancel(req: CancelRequest):
    delete_event(req.event_id)

    log_call_event(
        booking_status="cancelled",
        call_reason="cancellation",
        meta={"event_id": req.event_id}
    )

    return {"status": "cancelled"}


@app.post("/reschedule")
def reschedule(req: RescheduleRequest):
    updated = update_event(
        event_id=req.event_id,
        new_start=req.new_start,
        duration_minutes=30  # TODO: dynamically load from original event type if needed
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
    

@app.get("/appointments/by_phone")
def appointments_by_phone(phone: str):
    appointments = find_appointments_by_phone(phone)

    return {
        "count": len(appointments),
        "appointments": appointments
    }