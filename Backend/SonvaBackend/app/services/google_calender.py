import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dateutil import parser

load_dotenv()

# Google Calendar permission scope
# This tells Google what the service account is allowed to do.
# "calendar" means full access: create, update, delete events.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

GOOGLE_CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID")


def get_calendar_service():
    """
    Creates and returns a Google Calendar API client.
    
    What this function does:
    - Loads your service account credentials from environment variables
    - Converts the private key into the correct format
    - Authenticates with Google Calendar
    - Returns a 'service' object that can make API calls
    
    You call this whenever you want to create, update, or delete calendar events.
    """

    # Build a dictionary from environment variables.
    # This is the same format as a Google service account JSON file.
    creds_info = {
        "type": "service_account",
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "token_uri": "https://oauth2.googleapis.com/token",
    }

    # Turn dict into Google credentials
    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=SCOPES
    )

    # Build the actual Calendar service
    return build("calendar", "v3", credentials=credentials)


def create_event(summary, start, duration_minutes, patient_phone, patient_name=None):
    """
    Creates a new appointment in Google Calendar.

    What this function does:
    1. Connects to Google Calendar using our service account
    2. Calculates the event end time based on duration
    3. Creates an event object with details (title, description, start, end)
    4. Adds extra hidden metadata like patient name and phone number
    5. Sends the event to Google Calendar and returns the created event
    
    This is called when the AI receptionist books an appointment.
    """

    service = get_calendar_service()
    end = start + timedelta(minutes=duration_minutes)

    # Build the calendar event payload
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
                "source": "AI",
            }
        },
    }

    # Send event to Google Calendar
    return (
        service.events()
        .insert(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), body=event)
        .execute()
    )


def delete_event(event_id: str):
    """
    Deletes an event from Google Calendar.

    What this function does:
    - Connects to Google Calendar
    - Deletes an event using its event_id
    - Returns a simple confirmation dictionary

    This is used whenever a patient cancels their appointment.
    """

    service = get_calendar_service()

    service.events().delete(
        calendarId=os.getenv("GOOGLE_CALENDAR_ID"),
        eventId=event_id,
    ).execute()

    return {"status": "cancelled", "event_id": event_id}


def update_event(event_id: str, new_start: datetime, duration_minutes: int):
    """
    Updates (reschedules) an existing calendar event.

    What this function does:
    1. Connects to Google Calendar
    2. Fetches the existing event using event_id
    3. Recalculates the end time
    4. Updates the start and end times
    5. Sends the updated event back to Google
    
    This is used when a patient reschedules an appointment.
    """

    service = get_calendar_service()

    # Fetch the existing event
    event = (
        service.events()
        .get(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), eventId=event_id)
        .execute()
    )

    new_end = new_start + timedelta(minutes=duration_minutes)

    # Overwrite start + end times
    event["start"] = {
        "dateTime": new_start.isoformat(),
        "timeZone": "Europe/Dublin",
    }
    event["end"] = {
        "dateTime": new_end.isoformat(),
        "timeZone": "Europe/Dublin",
    }

    # Save the updated event
    return (
        service.events()
        .update(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), eventId=event_id, body=event)
        .execute()
    )

def get_freebusy(start: datetime, end: datetime):
    """
    Fetches all busy time ranges from Google Calendar between start and end.

    What this does:
    - Uses Google Calendar FreeBusy API
    - Asks Google which times are already booked
    - Returns a list of busy periods so we know which times to avoid
    """

    service = get_calendar_service()

    body = {
        "timeMin": start.isoformat(),
        "timeMax": end.isoformat(),
        "timeZone": "Europe/Dublin",
        "items": [{"id": os.getenv("GOOGLE_CALENDAR_ID")}]
    }

    response = service.freebusy().query(body=body).execute()

    return response["calendars"][os.getenv("GOOGLE_CALENDAR_ID")]["busy"]

def get_calendar_service():
    creds_info = {
        "type": "service_account",
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "token_uri": "https://oauth2.googleapis.com/token",
    }

    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=SCOPES
    )

    return build("calendar", "v3", credentials=credentials, cache_discovery=False)



def is_time_available(start_dt, end_dt):
    """
    Convert datetime objects into ISO8601 strings that Google accepts.
    No Z. No double timezone. Just pure isoformat().
    """

    if isinstance(start_dt, datetime):
        start_dt = start_dt.replace(microsecond=0).isoformat()

    if isinstance(end_dt, datetime):
        end_dt = end_dt.replace(microsecond=0).isoformat()

    service = get_calendar_service()

    events_result = (
        service.events()
        .list(
            calendarId=os.getenv("GOOGLE_CALENDAR_ID"),
            timeMin=start_dt,
            timeMax=end_dt,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )

    events = events_result.get("items", [])
    return len(events) == 0


def find_next_available_slot(start_time: datetime, duration_minutes: int):
    """
    Looks forward through the day in blocks until it finds a free slot.
    Accepts a datetime object, not a string.
    """
    current = start_time  # already a datetime object
    step = timedelta(minutes=15)

    while True:
        end_time = current + timedelta(minutes=duration_minutes)

        if is_time_available(current, end_time):
            return {
                "start": current.isoformat(),
                "end": end_time.isoformat()
            }

        current += step

