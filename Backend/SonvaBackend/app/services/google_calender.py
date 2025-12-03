import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dateutil import parser

load_dotenv()

# Google Calendar API permissions.
# This scope gives FULL read/write access to the calendar.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID")


# -------------------------------------------------
# CREATE GOOGLE CALENDAR API CLIENT
# -------------------------------------------------
def get_calendar_service():
    """
    Creates and returns a Google Calendar API client.

    What this function does:
    - Reads service account information from environment variables
    - Reconstructs the JSON credentials object Google expects
    - Authenticates using the service account
    - Returns a 'service' instance for performing Google Calendar operations

    You call this when creating, updating, reading, or deleting calendar events.
    """

    # Build credentials dictionary from env variables
    # Equivalent to loading an actual JSON key file
    creds_info = {
        "type": "service_account",
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "token_uri": "https://oauth2.googleapis.com/token",
    }

    # Create credentials object
    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=SCOPES
    )

    # Build Google Calendar client
    return build("calendar", "v3", credentials=credentials, cache_discovery=False)



# -------------------------------------------------
# CREATE EVENT
# -------------------------------------------------
def create_event(summary, start, duration_minutes, patient_phone, patient_name=None):
    """
    Creates an appointment in Google Calendar.

    Steps:
    1. Connects to Google Calendar
    2. Calculates end time based on duration
    3. Builds an event payload with metadata
    4. Saves event to Google Calendar
    5. Returns the created event

    Used when the AI receptionist books a new appointment.
    """

    service = get_calendar_service()
    end = start + timedelta(minutes=duration_minutes)

    event = {
        "summary": summary.capitalize(),
        "description": (
            f"Booked via AI Receptionist\n"
            f"Patient name: {patient_name or 'Unknown'}\n"
            f"Patient phone: {patient_phone}"
        ),
        "start": {"dateTime": start.isoformat(), "timeZone": "Europe/Dublin"},
        "end": {"dateTime": end.isoformat(), "timeZone": "Europe/Dublin"},
        "extendedProperties": {
            "private": {
                "patient_phone": patient_phone,
                "patient_name": patient_name or "",
                "source": "AI",                  # used internally for tracking AI-created events
                "duration": str(duration_minutes)
            }
        },
    }

    return (
        service.events()
        .insert(calendarId=GOOGLE_CALENDAR_ID, body=event)
        .execute()
    )



# -------------------------------------------------
# DELETE EVENT
# -------------------------------------------------
def delete_event(event_id: str):
    """
    Deletes an event from Google Calendar.

    What this function does:
    - Connects to Google Calendar
    - Calls the delete operation using event_id
    - Returns a confirmation object

    Used when a patient cancels their appointment.
    """

    service = get_calendar_service()

    service.events().delete(
        calendarId=GOOGLE_CALENDAR_ID,
        eventId=event_id,
    ).execute()

    return {"status": "cancelled", "event_id": event_id}



# -------------------------------------------------
# UPDATE (RESCHEDULE) EVENT
# -------------------------------------------------
def update_event(event_id: str, new_start: datetime, duration_minutes: int):
    """
    Updates an existing calendar event.

    Steps:
    1. Fetches the event
    2. Calculates a new end time
    3. Replaces existing start/end with updated values
    4. Pushes the update to Google Calendar
    5. Returns the updated event

    Used when a patient reschedules an appointment.
    """

    service = get_calendar_service()

    # Fetch event to modify
    event = (
        service.events()
        .get(calendarId=GOOGLE_CALENDAR_ID, eventId=event_id)
        .execute()
    )

    new_end = new_start + timedelta(minutes=duration_minutes)

    # Overwrite date/time values
    event["start"] = {
        "dateTime": new_start.isoformat(),
        "timeZone": "Europe/Dublin",
    }
    event["end"] = {
        "dateTime": new_end.isoformat(),
        "timeZone": "Europe/Dublin",
    }

    # Send updated event to Google
    return (
        service.events()
        .update(calendarId=GOOGLE_CALENDAR_ID, eventId=event_id, body=event)
        .execute()
    )



# -------------------------------------------------
# CHECK FREE/BUSY RANGE
# -------------------------------------------------
def get_freebusy(start: datetime, end: datetime):
    """
    Uses the FreeBusy API to retrieve every busy block between start and end.

    This is helpful when:
    - Checking availability for multiple slots
    - Finding long consecutive free periods
    """
    service = get_calendar_service()

    body = {
        "timeMin": start.isoformat(),
        "timeMax": end.isoformat(),
        "timeZone": "Europe/Dublin",
        "items": [{"id": GOOGLE_CALENDAR_ID}]
    }

    response = service.freebusy().query(body=body).execute()

    # FreeBusy API response structure:
    # { "calendars": { "calendar_id": { "busy": [ {start,end}, ... ] } } }
    return response["calendars"][GOOGLE_CALENDAR_ID]["busy"]



# -------------------------------------------------
# CHECK IF A TIME SLOT IS FREE
# -------------------------------------------------
def is_time_available(start_dt, end_dt):
    """
    Checks if a time range is free in Google Calendar.

    Accepts:
    - datetime objects OR already formatted ISO strings

    Steps:
    1. Convert to ISO8601 without milliseconds
    2. Query Google Calendar for overlapping events
    3. Return True if no events overlap
    """

    # Convert datetime → ISO string if needed
    if isinstance(start_dt, datetime):
        start_dt = start_dt.replace(microsecond=0).isoformat()

    if isinstance(end_dt, datetime):
        end_dt = end_dt.replace(microsecond=0).isoformat()

    service = get_calendar_service()

    events_result = (
        service.events()
        .list(
            calendarId=GOOGLE_CALENDAR_ID,
            timeMin=start_dt,
            timeMax=end_dt,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )

    events = events_result.get("items", [])
    return len(events) == 0  # True ⇒ slot is available



# -------------------------------------------------
# FIND NEXT AVAILABLE SLOT
# -------------------------------------------------
def find_next_available_slot(start_time: datetime, duration_minutes: int):
    """
    Finds the next free appointment slot by checking 15-minute increments.

    Steps:
    - Start at the requested time
    - Check availability
    - If taken, move forward by 15 minutes
    - Continue until a free slot is found
    """

    current = start_time  # datetime
    step = timedelta(minutes=15)

    while True:
        end_time = current + timedelta(minutes=duration_minutes)

        # If free slot → return it
        if is_time_available(current, end_time):
            return {
                "start": current.isoformat(),
                "end": end_time.isoformat()
            }

        # Otherwise move forward
        current += step
