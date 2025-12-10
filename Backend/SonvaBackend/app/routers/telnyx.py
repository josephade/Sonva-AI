from fastapi import APIRouter, Request
from app.services.supabase_client import (
    create_call_row,
    update_call,
    append_transcript,
    update_meta_json, 
    handle_direct_booking
)

router = APIRouter()

@router.post("/webhook")
async def telnyx_webhook(request: Request):
    body = await request.json()

    # -----------------------------------------
    # CASE 1 - Telnyx Test Webhook
    # -----------------------------------------
    if "appointment_type" in body:
        return handle_direct_booking(body)


    # -----------------------------------------
    # CASE 2 - Real Telnyx AI Assistant events
    # -----------------------------------------
    try:
        event = body["data"]["event_type"]
        payload = body["data"]["payload"]
    except Exception as e:
        return {"error": "Invalid Telnyx payload", "detail": str(e)}

    call_id = payload.get("call_control_id")

    # -----------------------------------------
    # CALL STARTED
    # -----------------------------------------
    if event == "ai.call.started":
        create_call_row(
            call_id=call_id,
            phone_number=payload.get("caller_number")
        )

    # -----------------------------------------
    # TRANSCRIPT (patient speaking)
    # -----------------------------------------
    if event == "ai.message.received":
        append_transcript(call_id, payload.get("text", ""))

    # -----------------------------------------
    # INTENT DETECTED
    # -----------------------------------------
    if event == "ai.intent.detected":
        update_call(call_id, {"intent": payload.get("intent")})

    # -----------------------------------------
    # PARAMETERS / ENTITIES (patient data)
    # -----------------------------------------
    if event == "ai.parameters.extracted":
        entities = payload.get("entities", {})
        update_call(call_id, {
            "patient_name": entities.get("patient_name"),
            "patient_age": entities.get("age"),
            "patient_dob": entities.get("dob"),
            "patient_insurance": entities.get("insurance"),
        })

        update_meta_json(call_id, {"entities": entities})

    # -----------------------------------------
    # SUMMARY
    # -----------------------------------------
    if event == "ai.summary.generated":
        update_call(call_id, {"summary": payload.get("summary")})

    # -----------------------------------------
    # RECORDING
    # -----------------------------------------
    if event == "ai.recording.available":
        update_call(call_id, {
            "recording_url": payload.get("recording_url")
        })

    # -----------------------------------------
    # CALL ENDED → SAVE DURATION
    # -----------------------------------------
    if event == "ai.call.ended":
        duration = payload.get("duration_seconds")
        update_call(call_id, {
            "duration_seconds": duration,
            "call_status": "completed"
        })

    return {"received": True}
