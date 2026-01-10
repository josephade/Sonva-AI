import os
from typing import Optional
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# Load .env from SonvaBackend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError(
        "Missing required environment variables. Please create a .env file in the SonvaBackend directory "
        "with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    )

supabase = create_client(supabase_url, supabase_key)


# ----------------------------------
# Fetch appointment duration
# ----------------------------------

def get_appointment_duration(appointment_type: str) -> Optional[int]:
    """Fetch duration_minutes from appointment_types table."""
    result = (
        supabase.table("appointment_types")
        .select("duration_minutes")
        .eq("name", appointment_type.lower())
        .single()
        .execute()
    )

    if result.data:
        return result.data["duration_minutes"]

    return None


# ----------------------------------
# Log to call_events
# ----------------------------------

def log_call_event(
    booking_status: Optional[str] = None,
    patient_name: Optional[str] = None,
    patient_phone: Optional[str] = None,
    call_reason: Optional[str] = None,
    call_id: Optional[str] = None,
    duration_seconds: Optional[int] = None,
    meta: Optional[dict] = None,
    outcome_value_eur: Optional[float] = None,
):
    payload = {
        "booking_status": booking_status,   # booked/cancelled/rescheduled or null
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "call_reason": call_reason,
        "call_id": call_id,
        "duration_seconds": duration_seconds,
        "meta": meta,
        "outcome_value_eur": outcome_value_eur,
    }

    filtered_payload = {k: v for k, v in payload.items() if v is not None}

    supabase.table("call_events").insert(filtered_payload).execute()
    
def find_appointments_by_phone(phone_number: str):
    """
    Return all active bookings (status=booked) for a given phone number.
    Uses Supabase as the primary lookup source.
    """
    result = (
        supabase.table("call_events")
        .select("*")
        .eq("patient_phone", phone_number)
        .eq("booking_status", "booked")   # only active bookings
        .order("created_at", desc=False)
        .execute()
    )

    appointments = []

    for row in result.data:
        meta = row.get("meta", {})

        # skip if event metadata is missing
        if not meta or "id" not in meta:
            continue

        appointments.append({
            "event_id": meta["id"],
            "summary": meta.get("summary") or meta.get("title") or "Appointment",
            "start": meta["start"]["dateTime"] if "start" in meta else None,
            "end": meta["end"]["dateTime"] if "end" in meta else None,
            "patient_name": row.get("patient_name"),
            "patient_phone": row.get("patient_phone"),
        })

    return appointments