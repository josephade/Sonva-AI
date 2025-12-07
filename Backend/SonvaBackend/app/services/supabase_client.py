import os
from supabase import create_client
from dotenv import load_dotenv
import uuid

load_dotenv()

# -------------------------------------------------
# SUPABASE CLIENT (GLOBAL SINGLETON)
# -------------------------------------------------
# We create the client ONCE so the entire FastAPI backend shares it.
# This avoids repeatedly opening new HTTP connections on each request.
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)



# -------------------------------------------------
# FETCH APPOINTMENT DURATION
# -------------------------------------------------
def get_appointment_duration(appointment_type: str) -> int | None:
    """
    Looks up the duration of an appointment type from Supabase.

    Why this exists:
    - The AI receptionist needs the correct duration to compute end_time
    - Durations may vary (cleaning = 30 mins, checkup = 20 mins)

    Returns:
    - duration in minutes OR None if type doesn't exist
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



# -------------------------------------------------
# LOG CALL EVENT
# -------------------------------------------------
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

    Why this is important:
    - Powers the dentist's analytics dashboard
    - Gives AI memory of patient history (bookings, cancellations, etc.)
    - Tracks conversions (e.g. call → booking)
    - Stores metadata from Google Calendar

    Fields saved include:
      booking_status (booked, cancelled, rescheduled)
      event metadata (start/end times)
      call duration (for voice analytics)
      patient info
    """

    if call_id is None:
        call_id = str(uuid.uuid4())  # generate unique call ID

    # Extract start/end from Google Calendar event, if passed in
    booking_start = None
    booking_end = None

    if isinstance(meta, dict):
        try:
            booking_start = meta.get("start", {}).get("dateTime")
            booking_end = meta.get("end", {}).get("dateTime")
        except Exception:
            pass  # fail silently — safe fallback

    # Build row to insert
    payload = {
        "booking_status": booking_status,
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "call_reason": call_reason,
        "call_id": call_id,
        "duration_seconds": duration_seconds,
        "meta": meta,                   # full Google event payload
        "outcome_value_eur": outcome_value_eur,
        "booking_start": booking_start,
        "booking_end": booking_end,
    }

    # Remove empty or null fields
    clean_payload = {k: v for k, v in payload.items() if v is not None}

    print("Logging call event:", clean_payload)

    supabase.table("call_events").insert(clean_payload).execute()



# -------------------------------------------------
# FETCH ACTIVE APPOINTMENTS BY PHONE
# -------------------------------------------------
def find_appointments_by_phone(phone_number: str):
    """
    Returns ALL active (non-cancelled) booked appointments for a phone number.

    Why this is important:
    - Allows the AI receptionist to say:
      "I found a booking for you on February 5 at 3 PM."

    Returns formatted appointment objects:
    {
        "event_id": "abc123",
        "summary": "Checkup",
        "start": "2025-02-05T15:00:00",
        "end": "2025-02-05T15:20:00",
        "patient_name": "...",
        "patient_phone": "..."
    }
    """

    result = (
        supabase.table("call_events")
        .select("*")
        .eq("patient_phone", phone_number)
        .eq("booking_status", "booked")  # only active bookings
        .order("created_at", desc=False)
        .execute()
    )

    if not result.data:
        return []

    appointments = []

    for row in result.data:
        meta = row.get("meta", {})

        # Only include rows that actually contain Google Calendar metadata
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



# -------------------------------------------------
# GET DURATION FOR TYPE (STRICT VERSION)
# -------------------------------------------------
def get_duration_for_type(appointment_type: str) -> int:
    """
    Returns duration for the given appointment type.

    Unlike get_appointment_duration(), this version:
    - Does NOT default to None
    - Raises an exception if the appointment type is unknown

    This is used in places where the duration MUST exist.
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



# -------------------------------------------------
# CALCULATE END TIME FOR APPOINTMENTS
# -------------------------------------------------
from dateutil import parser
from datetime import datetime, timedelta

def calculate_end_time(start_input, duration_minutes):
    """
    Calculates the end time of an appointment.

    Accepts:
    - ISO string (e.g., "2025-02-05T15:00:00")
    - datetime object

    Returns:
    - datetime object of the end time

    Used by:
    - booking 
    - rescheduling
    """

    # Convert string → datetime
    if isinstance(start_input, datetime):
        start_dt = start_input
    else:
        start_dt = parser.isoparse(start_input)

    end_dt = start_dt + timedelta(minutes=duration_minutes)
    return end_dt

# -------------------------------------------------
# CREATE NEW CALL ROW (CALL STARTED)
# -------------------------------------------------
def create_call_row(call_id: str, phone_number: str):
    """
    Inserts a new row into call_events when a call starts.
    Ensures ALL required fields exist with defaults.
    """

    payload = {
        "call_id": call_id,
        "patient_phone": phone_number,
        "event_type": "call_started",
        "call_status": "in_progress",

        # Defaults for all required columns
        "transcript": "",
        "summary": "",
        "intent": "",
        "patient_name": "",
        "patient_age": None,
        "patient_dob": None,
        "patient_insurance": "",
        "duration_seconds": 0,
        "booking_status": "none",
        "booking_start": None,
        "booking_end": None,
        "recording_url": "",
        "audio_url": "",
        "meta": {},
    }

    return supabase.table("call_events").insert(payload).execute()

# -------------------------------------------------
# APPEND TRANSCRIPT CHUNK
# -------------------------------------------------
def append_transcript(call_id: str, text: str):
    """
    Adds transcript text to the existing transcript.
    """

    row = (
        supabase.table("call_events")
        .select("transcript")
        .eq("call_id", call_id)
        .single()
        .execute()
    )

    old_text = row.data.get("transcript") or ""
    new_text = old_text + "\n" + text

    supabase.table("call_events").update({
        "transcript": new_text
    }).eq("call_id", call_id).execute()

# -------------------------------------------------
# UPDATE CALL ROW (ANY FIELDS)
# -------------------------------------------------
def update_call(call_id: str, fields: dict):
    """
    Generic update helper — updates ANY field(s)
    in the call_events row for the given call_id.
    """

    print(f"Updating call {call_id}: {fields}")

    supabase.table("call_events").update(fields).eq("call_id", call_id).execute()

# -------------------------------------------------
# UPDATE META JSON FIELD
# -------------------------------------------------
def update_meta_json(call_id: str, new_meta: dict):
    """
    Safely merges new metadata into the existing meta JSONB.
    """

    row = (
        supabase.table("call_events")
        .select("meta")
        .eq("call_id", call_id)
        .single()
        .execute()
    )

    old = row.data.get("meta") or {}
    merged = {**old, **new_meta}

    supabase.table("call_events").update({
        "meta": merged
    }).eq("call_id", call_id).execute()
