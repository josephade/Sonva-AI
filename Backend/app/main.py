from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from app.models import LogEvent
from app.services.supabase_client import SupabaseService
from app.services.calender_client import CalendarService
from datetime import datetime, timezone
import os

app = FastAPI(title="Sonva AI", version="1.0")
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ---- SUPABASE ----
@app.post("/log-event")   # <-- fixed missing '@'
def log_event(e: LogEvent):
    db = SupabaseService()
    inserted = db.log_event(e.call_id, e.event_type, e.payload)
    return {"status": "ok", "inserted": inserted}


# ---- GOOGLE CALENDAR ----
@app.get("/authorize")
def authorize():
    """Return the Google OAuth authorization URL."""
    cal = CalendarService()
    return {"auth_url": cal.authorize()}


@app.get("/oauth2callback")
def oauth2callback(request: Request):
    """Handle Google OAuth redirect automatically."""
    try:
        full_url = str(request.url)
        cal = CalendarService()
        cal.oauth_callback(full_url)
        return {"message": "Google authorization complete", "token_saved": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/book")
def book_appointment():
    """Create a test appointment in the authorized Google Calendar."""
    try:
        cal = CalendarService()
        event = cal.book_event("Dental Appointment", datetime.now(timezone.utc))

        db = SupabaseService()
        db.log_event(
            call_id="demo",
            event_type="booked",
            payload={
                "event_id": event.get("id"),
                "summary": event.get("summary"),
                "start": event["start"].get("dateTime"),
                "end": event["end"].get("dateTime"),
            },
        )

        return {"status": "ok", "event": event}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking failed: {e}")
    

# ---- CANCEL EVENT ----
@app.post("/cancel")
def cancel_appointment(event_id: str):
    cal = CalendarService()
    result = cal.cancel_event(event_id)
    db = SupabaseService()
    db.log_event(call_id="demo-cancel", event_type="cancelled", payload=result)
    return {"status": "ok", "message": "Booking cancelled", "data": result}


# ---- RESCHEDULE EVENT ----
@app.post("/reschedule")
def reschedule_appointment(event_id: str, new_start: str):
    try:
        new_time = datetime.fromisoformat(new_start)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid datetime format")

    cal = CalendarService()
    result = cal.reschedule_event(event_id, new_time)
    db = SupabaseService()
    db.log_event(call_id="demo-reschedule", event_type="rescheduled", payload=result)
    return {"status": "ok", "message": "Booking rescheduled", "data": result}


@app.get("/token")
def get_livekit_token():
    """Returns a LiveKit join token for the demo room."""
    lk = LiveKitService()
    return lk.create_token()