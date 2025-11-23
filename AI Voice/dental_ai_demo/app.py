import os
import uuid
import json
import datetime as dt
from typing import Dict, Any, Optional

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from dotenv import load_dotenv
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

CLINIC_NAME = os.getenv("CLINIC_NAME", "Pearl Dental Care")
CLINIC_PHONE = os.getenv("CLINIC_PHONE", "+353 1 234 5678")
CLINIC_ADDRESS = os.getenv("CLINIC_ADDRESS", "12 Dawson St, Dublin 2, D02")
CLINIC_HOURS = os.getenv("CLINIC_HOURS", "Mon–Fri 09:00–17:30; Sat 10:00–14:00; Sun Closed")
CLINIC_INSURANCE = os.getenv("CLINIC_INSURANCE", "We accept VHI, Irish Life Health, and Laya, plus major private insurers.")

assert OPENAI_API_KEY, "Missing OPENAI_API_KEY in your .env"
assert ELEVENLABS_API_KEY, "Missing ELEVENLABS_API_KEY in your .env"

ocli = OpenAI(api_key=OPENAI_API_KEY)
ecli = ElevenLabs(api_key=ELEVENLABS_API_KEY)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

STATE: Dict[str, Any] = {
    "calls": []
}

def now_iso():
    return dt.datetime.utcnow().isoformat()

def clinic_profile():
    return {
        "name": CLINIC_NAME,
        "phone": CLINIC_PHONE,
        "address": CLINIC_ADDRESS,
        "hours": CLINIC_HOURS,
        "insurance": CLINIC_INSURANCE,
    }

async def detect_intent(user_text: str) -> str:
    """
    Lightweight intent detection using GPT. Keep it deterministic & cheap.
    Returns one of: 'book', 'reschedule', 'cancel', 'faq', 'goodbye', 'other'
    """
    system = (
        "You are a strict intent classifier for a dental clinic call. "
        "Possible intents: book, reschedule, cancel, faq, goodbye, other. "
        "Return ONLY the label."
    )
    prompt = f"User: {user_text}\nLabel:"
    resp = ocli.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"system","content":system},
                  {"role":"user","content":prompt}],
        temperature=0.0,
        max_tokens=3,
    )
    label = resp.choices[0].message.content.strip().lower()
    if label not in {"book","reschedule","cancel","faq","goodbye","other"}:
        label = "other"
    return label

async def draft_reply(user_text: str, intent: str) -> str:
    """
    Generate a short, natural receptionist-style reply grounded in clinic profile.
    Keep answers concise and friendly.
    """
    profile = clinic_profile()
    system = (
        f"You are a warm, efficient receptionist for {profile['name']} in Dublin. "
        "Be concise (1–2 sentences). Ask one helpful follow-up when relevant. "
        "If FAQ, answer from the profile below.\n\n"
        f"PROFILE:\nAddress: {profile['address']}\n"
        f"Phone: {profile['phone']}\nHours: {profile['hours']}\nInsurance: {profile['insurance']}"
    )
    user = f"Caller said: {user_text}\nDetected intent: {intent}."
    resp = ocli.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"system","content":system},
                  {"role":"user","content":user}],
        temperature=0.3,
        max_tokens=140,
    )
    return resp.choices[0].message.content.strip()

async def tts_to_file(text: str) -> str:
    """
    Uses ElevenLabs to synthesize an MP3 and saves to /static. Returns public URL path.
    """
    import pathlib
    pathlib.Path("static").mkdir(parents=True, exist_ok=True)
    fname = f"resp-{uuid.uuid4().hex}.mp3"
    out_path = os.path.join("static", fname)

    audio = ecli.text_to_speech.convert(
        voice_id=ELEVENLABS_VOICE_ID,
        optimize_streaming_latency="0",
        output_format="mp3_44100_128",
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings=VoiceSettings(stability=0.5, similarity_boost=0.75, style=0.2, use_speaker_boost=True),
    )

    with open(out_path, "wb") as f:
        for chunk in audio:
            if chunk:
                f.write(chunk)

    return f"/static/{fname}"

def twiml_response(body: str) -> PlainTextResponse:
    return PlainTextResponse(content=body, media_type="application/xml")

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/state")
async def api_state():
    return JSONResponse({
        "clinic": clinic_profile(),
        "calls": list(reversed(STATE["calls"]))
    })

@app.post("/voice/incoming")
async def voice_incoming(
    request: Request,
    CallSid: Optional[str] = Form(None),
    From: Optional[str] = Form(None)
):
    sid = CallSid or uuid.uuid4().hex
    call = {
        "sid": sid,
        "from": From,
        "started_at": now_iso(),
        "status": "in-progress",
        "turns": [{
            "speaker": "ai",
            "text": f"Hello, you’ve reached {CLINIC_NAME}. How can I help you today?"
        }]
    }
    STATE["calls"].append(call)

    greeting = f"Hello, you’ve reached {CLINIC_NAME}. How can I help you today?"
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>{greeting}</Say>
  <Gather input="speech" action="/voice/handle" method="POST" language="en-IE" speechTimeout="auto" />
</Response>
"""
    return twiml_response(twiml.strip())

@app.post("/voice/handle")
async def voice_handle(
    request: Request,
    CallSid: Optional[str] = Form(None),
    SpeechResult: Optional[str] = Form(None)
):
    call = next((c for c in STATE["calls"] if c["sid"] == CallSid), None)
    if not call:
        call = {"sid": CallSid or uuid.uuid4().hex, "from": None, "started_at": now_iso(), "status": "in-progress", "turns": []}
        STATE["calls"].append(call)

    user_text = (SpeechResult or "").strip()
    if user_text:
        call["turns"].append({"speaker": "human", "text": user_text})

    intent = await detect_intent(user_text or "")
    reply = await draft_reply(user_text or "Hello", intent=intent)
    audio_url = await tts_to_file(reply)

    call["turns"].append({"speaker": "ai", "text": reply, "intent": intent, "audio_url": audio_url})

    should_close = intent in {"goodbye"} or len(call["turns"]) >= 8

    if should_close:
        call["status"] = "completed"
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>{audio_url}</Play>
  <Say>Thanks for calling. Goodbye!</Say>
  <Hangup/>
</Response>
"""
    else:
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>{audio_url}</Play>
  <Gather input="speech" action="/voice/handle" method="POST" language="en-IE" speechTimeout="auto" />
</Response>
"""
    return twiml_response(twiml.strip())

@app.get("/healthz")
async def healthz():
    return {"ok": True}
