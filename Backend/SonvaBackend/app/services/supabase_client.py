import os
from supabase import create_client
from dotenv import load_dotenv
import uuid

load_dotenv()

# Create Supabase client once so the whole app can use it
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

def get_appointment_duration(appointment_type: str) -> int | None:
    """
    Looks up the duration (in minutes) of an appointment type from Supabase.

    Example:
    "cleaning" → 30 minutes
    "checkup" → 20 minutes

    The AI receptionist uses this to calculate the end time of the appointment.
    """

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


def log_call_event(
    booking_status=None,
    patient_name=None,
    patient_phone=None,
    call_reason=None,
    call_id=None,
    duration_seconds=None,
    meta=None,
    outcome_value_eur=None,
):
    """
    Saves a call event into Supabase.

    Logged data powers:
    - Dentist dashboard call timeline
    - AI agent memory (has this person booked before?)
    - Conversion tracking
    - Appointment history
    """

    import uuid

    if call_id is None:
        call_id = str(uuid.uuid4())

    # -----------------------------
    # Extract start/end from Google event
    # -----------------------------
    booking_start = None
    booking_end = None

    if isinstance(meta, dict):
        try:
            booking_start = meta.get("start", {}).get("dateTime")
            booking_end = meta.get("end", {}).get("dateTime")
        except Exception:
            pass

    # -----------------------------
    # Build payload
    # -----------------------------
    payload = {
        "booking_status": booking_status,
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "call_reason": call_reason,
        "call_id": call_id,
        "duration_seconds": duration_seconds,
        "meta": meta,
        "outcome_value_eur": outcome_value_eur,
        "booking_start": booking_start,
        "booking_end": booking_end,
    }

    # Remove empty values
    clean_payload = {k: v for k, v in payload.items() if v is not None}

    print("Logging call event:", clean_payload)

    supabase.table("call_events").insert(clean_payload).execute()




def find_appointments_by_phone(phone_number: str):
    """
    Returns all ACTIVE booked appointments for a given phone number.

    Returned objects look like:
    {
        "event_id": "...",
        "summary": "Checkup",
        "start": "2025-02-05T15:00:00",
        "end": "2025-02-05T15:20:00",
        "patient_name": "John Doe",
        "patient_phone": "+353871234567"
    }
    """

    result = (
        supabase.table("call_events")
        .select("*")
        .eq("patient_phone", phone_number)
        .eq("booking_status", "booked")
        .order("created_at", desc=False)
        .execute()
    )

    if not result.data:
        return []

    appointments = []

    for row in result.data:
        meta = row.get("meta", {})

        # We only return results if there is calendar metadata
        if not isinstance(meta, dict) or "id" not in meta:
            continue

        appointments.append({
            "event_id": meta.get("id"),
            "summary": meta.get("summary") or meta.get("title") or "Appointment",
            "start": meta.get("start", {}).get("dateTime"),
            "end": meta.get("end", {}).get("dateTime"),
            "patient_name": row.get("patient_name"),
            "patient_phone": row.get("patient_phone"),
        })

    return appointments

def get_duration_for_type(appointment_type: str) -> int:
    """
    Returns the duration (in minutes) for the given appointment type.
    Example: 'cleaning' -> 60
    """

    result = (
        supabase.table("appointment_types")
        .select("duration_minutes")
        .eq("name", appointment_type)
        .single()
        .execute()
    )

    if not result.data:
        raise ValueError(f"Unknown appointment type: {appointment_type}")

    return result.data["duration_minutes"]

from dateutil import parser
from datetime import timedelta

def calculate_end_time(start_iso: str, duration_minutes: int) -> str:
    """
    Computes the end time based on start time + duration.
    Returns ISO 8601 timestamp.
    """
    start_dt = parser.isoparse(start_iso)
    end_dt = start_dt + timedelta(minutes=duration_minutes)
    return end_dt.isoformat()


