from fastapi import APIRouter, HTTPException, Depends
from app.services.supabase_client import supabase
from datetime import datetime, timedelta

router = APIRouter()

# ADMIN API KEY HEADER (Optional but recommended for security)
from fastapi import Header

def verify_admin(api_key: str = Header(None)):
    """
    Basic admin protection for dashboard endpoints.
    Backend ADMIN_API_KEY is stored in Render env vars.
    """
    import os
    ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")

    if not ADMIN_API_KEY:
        return True  # no protection configured

    if api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin API key")

    return True


# -----------------------------
# DASHBOARD ROUTES
# -----------------------------

@router.get("/stats", dependencies=[Depends(verify_admin)])
def dashboard_stats():
    """
    GENERAL DASHBOARD STATS
    -----------------------
    Returns:
      - total calls
      - total bookings
      - cancellations
      - reschedules
      - revenue estimate (if stored)
    """

    # Fetch all events
    data = supabase.table("call_events").select("*").execute().data or []

    total_calls = len(data)
    total_booked = sum(1 for x in data if x.get("booking_status") == "booked")
    total_cancelled = sum(1 for x in data if x.get("booking_status") == "cancelled")
    total_rescheduled = sum(1 for x in data if x.get("booking_status") == "rescheduled")

    revenue = sum(
        float(x.get("outcome_value_eur", 0)) for x in data if x.get("outcome_value_eur")
    )

    return {
        "total_calls": total_calls,
        "booked": total_booked,
        "cancelled": total_cancelled,
        "rescheduled": total_rescheduled,
        "estimated_revenue": revenue,
    }


@router.get("/recent", dependencies=[Depends(verify_admin)])
def recent_events(limit: int = 20):
    """
    RETURNS THE MOST RECENT CALL/EVENT LOGS
    """
    result = (
        supabase.table("call_events")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )

    return {"events": result.data}


@router.get("/upcoming", dependencies=[Depends(verify_admin)])
def upcoming_appointments():
    """
    LIST ALL UPCOMING APPOINTMENTS BASED ON STORED META.
    """
    now = datetime.utcnow().isoformat()

    result = (
        supabase.table("call_events")
        .select("*")
        .eq("booking_status", "booked")
        .execute()
    )

    events = []
    for row in result.data:
        meta = row.get("meta")
        if not meta:
            continue

        start = meta.get("start", {}).get("dateTime")
        if start and start > now:
            events.append(row)

    return {"upcoming": events}


@router.get("/filter", dependencies=[Depends(verify_admin)])
def filter_events(event_type: str = None):
    """
    FILTER EVENTS BY BOOKING TYPE / REASON.
    Example:
        /dashboard/filter?event_type=cleaning
    """

    query = supabase.table("call_events").select("*")

    if event_type:
        query = query.eq("call_reason", event_type)

    result = query.order("created_at", desc=True).execute()

    return {"results": result.data}
