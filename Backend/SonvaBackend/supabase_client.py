import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)


# ----------------------------------
# Fetch appointment duration
# ----------------------------------

def get_appointment_duration(appointment_type: str) -> int | None:
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
    booking_status: str | None = None,
    patient_name: str | None = None,
    patient_phone: str | None = None,
    call_reason: str | None = None,
    call_id: str | None = None,
    duration_seconds: int | None = None,
    meta: dict | None = None,
    outcome_value_eur: float | None = None,
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