from fastapi import APIRouter, Request, HTTPException
import json
from app.services.supabase_client import log_call_event
from app.routers.booking import book, cancel, reschedule

router = APIRouter()

# -----------------------------
# Telnyx Webhook Endpoint
# -----------------------------

@router.post("/webhook")
async def telnyx_webhook(request: Request):
    """
    MAIN ENTRY POINT FOR TELNYX LLM AGENT
    -------------------------------------
    The Telnyx LLM agent sends:
        - intents (book, cancel, reschedule)
        - call events
        - NLU extracted data
    """

    try:
        body = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON from Telnyx")

    # Log raw payload for debugging (optional)
    log_call_event(
        event_type="telnyx_raw",
        meta=body
    )

    intent = body.get("intent")

    # -----------------------------
    #  BOOKING
    # -----------------------------
    if intent == "book":
        try:
            req = body["data"]
            return book(req)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # -----------------------------
    #  CANCELLATION
    # -----------------------------
    if intent == "cancel":
        try:
            req = body["data"]
            return cancel(req)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # -----------------------------
    #  RESCHEDULE
    # -----------------------------
    if intent == "reschedule":
        try:
            req = body["data"]
            return reschedule(req)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    # -----------------------------
    # CALL ENDED EVENT
    # -----------------------------
    if intent == "call_end":
        log_call_event(event_type="call_end", meta=body)
        return {"status": "logged"}

    return {"message": "Webhook received", "intent": intent}
