import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # allow HTTP for local dev

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from fastapi import HTTPException
from datetime import datetime, timedelta

SCOPES = ["https://www.googleapis.com/auth/calendar"]
REDIRECT_URI = "http://127.0.0.1:8000/oauth2callback"

class CalendarService:
    def authorize(self):
        """Generate Google OAuth authorization URL."""
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json",
            SCOPES,
            redirect_uri=REDIRECT_URI
        )
        auth_url, _ = flow.authorization_url(prompt="consent")
        return auth_url

    @staticmethod
    def oauth_callback(url: str):
        """Exchange auth code for access token and save token.json"""
        flow = InstalledAppFlow.from_client_secrets_file(
            "credentials.json",
            SCOPES,
            redirect_uri=REDIRECT_URI
        )
        flow.fetch_token(authorization_response=url)
        creds = flow.credentials
        with open("token.json", "w") as token:
            token.write(creds.to_json())
        return True

    @staticmethod
    def book_event(summary: str, start_time: datetime, duration_minutes: int = 30):
        try:
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
            service = build("calendar", "v3", credentials=creds)

            event = {
                "summary": summary,
                "start": {"dateTime": start_time.isoformat(), "timeZone": "Europe/Dublin"},
                "end": {"dateTime": (start_time + timedelta(minutes=duration_minutes)).isoformat(), "timeZone": "Europe/Dublin"},
                "description": "Booked via AI Receptionist",
            }

            return service.events().insert(calendarId="primary", body=event).execute()
        except Exception as ex:
            raise HTTPException(status_code=500, detail=f"Calendar booking error: {ex}")
        
    @staticmethod
    def cancel_event(event_id: str):
        """Cancel (delete) an existing calendar event."""
        try:
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
            service = build("calendar", "v3", credentials=creds)
            service.events().delete(calendarId="primary", eventId=event_id).execute()
            return {"status": "cancelled", "event_id": event_id}
        except Exception as ex:
            raise HTTPException(status_code=500, detail=f"Cancel error: {ex}")

    @staticmethod
    def reschedule_event(event_id: str, new_start: datetime, duration_minutes: int = 30):
        """Reschedule (update start/end times) for an existing event."""
        try:
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
            service = build("calendar", "v3", credentials=creds)

            event = service.events().get(calendarId="primary", eventId=event_id).execute()
            event["start"]["dateTime"] = new_start.isoformat()
            event["end"]["dateTime"] = (new_start + timedelta(minutes=duration_minutes)).isoformat()

            updated = service.events().update(calendarId="primary", eventId=event_id, body=event).execute()
            return {"status": "rescheduled", "event": updated}
        except Exception as ex:
            raise HTTPException(status_code=500, detail=f"Reschedule error: {ex}")