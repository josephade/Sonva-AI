import os
from supabase import create_client
from dotenv import load_dotenv

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

    Why we log:
    - To show call activity in the dentist dashboard
    - To track bookings made by the AI receptionist
    - To calculate conversion rates (calls → bookings)
    - To store metadata like the Google Calendar event

    Anything that is None is removed from the payload.
    """

    payload = {
        "booking_status": booking_status,
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "call_reason": call_reason,
        "call_id": call_id,
        "duration_seconds": duration_seconds,
        "meta": meta,
        "outcome_value_eur": outcome_value_eur,
    }

    filtered = {k: v for k, v in payload.items() if v is not None}

    supabase.table("call_events").insert(filtered).execute()


def find_appointments_by_phone(phone_number: str):
    """
    Returns all active booked appointments for a given phone number.

    How it works:
    1. Searches the 'call_events' table for entries where:
       - patient_phone matches
       - booking_status == "booked"
    2. Extracts metadata (actual calendar event details)
    3. Returns a clean list of appointments for display

    This powers:
    - The AI receptionist ("Do I already have an appointment?")
    - The dentist dashboard upcoming appointments view
    """

    result = (
        supabase.table("call_events")
        .select("*")
        .eq("patient_phone", phone_number)
        .eq("booking_status", "booked")
        .order("created_at", desc=False)
        .execute()
    )

    appointments = []

    for row in result.data:
        meta = row.get("meta", {})

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
