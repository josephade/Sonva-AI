import os
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

load_dotenv()

def get_calendar_service():
    creds_info = {
        "type": "service_account",
        "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
        "token_uri": "https://oauth2.googleapis.com/token"
    }

    credentials = service_account.Credentials.from_service_account_info(
        creds_info,
        scopes=["https://www.googleapis.com/auth/calendar"]
    )

    return build("calendar", "v3", credentials=credentials)

def test_create_event():
    service = get_calendar_service()

    start_time = datetime.utcnow() + timedelta(minutes=5)
    end_time = start_time + timedelta(minutes=30)

    event = {
        "summary": "Test Appointment (AI Agent)",
        "start": {"dateTime": start_time.isoformat() + "Z"},
        "end": {"dateTime": end_time.isoformat() + "Z"},
    }

    created = service.events().insert(
        calendarId=os.getenv("GOOGLE_CALENDAR_ID"),
        body=event
    ).execute()

    print("EVENT CREATED:")
    print(created)
    print("Event link:", created.get("htmlLink"))

if __name__ == "__main__":
    test_create_event()