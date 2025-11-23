from supabase import create_client
from fastapi import HTTPException
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

load_dotenv()


class SupabaseService:
    """Handles all Supabase operations (logging, analytics)."""

    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise ValueError("Missing Supabase environment variables")

        self.client = create_client(url, key)

    def log_event(self, call_id: str, event_type: str, payload: dict | None = None):
        """Insert a call event into Supabase."""
        try:
            data = {
                "call_id": call_id,
                "event_type": event_type,
                "meta": payload or {},
                "created_at": datetime.now(timezone.utc).isoformat(),
            }

            # Map optional fields from payload (for analytics)
            if payload:
                data["call_reason"] = payload.get("call_reason")
                data["booking_start"] = (
                    payload.get("start", {}).get("dateTime")
                    if isinstance(payload.get("start"), dict)
                    else None
                )
                data["booking_end"] = (
                    payload.get("end", {}).get("dateTime")
                    if isinstance(payload.get("end"), dict)
                    else None
                )
                data["booking_status"] = event_type
                data["outcome_value_eur"] = payload.get("value")

            res = self.client.table("call_events").insert(data).execute()
            return res.data
        except Exception as ex:
            raise HTTPException(status_code=500, detail=f"Supabase insert failed: {ex}")