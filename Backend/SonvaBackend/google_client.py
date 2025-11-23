import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def get_calendar_service():
    """Create an authenticated Google Calendar API client using a service account."""
    creds_info = {
        "type": "service_account",
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "token_uri": "https://oauth2.googleapis.com/token",
    }

    credentials = service_account.Credentials.from_service_account_info(
        creds_info, scopes=SCOPES
    )

    return build("calendar", "v3", credentials=credentials)


def create_event(
    summary: str,
    start: datetime,
    duration_minutes: int,
    patient_phone: str,
    patient_name: str | None = None,
):
    """Create a new appointment with patient metadata."""
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
                "source": "AI",
            }
        },
    }

    return (
        service.events()
        .insert(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), body=event)
        .execute()
    )


def delete_event(event_id: str):
    """Cancel an appointment using its Google Calendar event_id."""
    service = get_calendar_service()

    service.events().delete(
        calendarId=os.getenv("GOOGLE_CALENDAR_ID"),
        eventId=event_id,
    ).execute()

    return {"status": "cancelled", "event_id": event_id}


def update_event(event_id: str, new_start: datetime, duration_minutes: int):
    """Reschedule an existing appointment."""
    service = get_calendar_service()

    event = (
        service.events()
        .get(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), eventId=event_id)
        .execute()
    )

    new_end = new_start + timedelta(minutes=duration_minutes)

    event["start"] = {
        "dateTime": new_start.isoformat(),
        "timeZone": "Europe/Dublin",
    }
    event["end"] = {
        "dateTime": new_end.isoformat(),
        "timeZone": "Europe/Dublin",
    }

    return (
        service.events()
        .update(calendarId=os.getenv("GOOGLE_CALENDAR_ID"), eventId=event_id, body=event)
        .execute()
    )