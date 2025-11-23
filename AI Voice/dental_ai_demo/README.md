# AI Dental Receptionist — Python Demo (Twilio + ElevenLabs + FastAPI)

A **turn-based** phone demo: callers dial your Twilio number, talk, and the AI replies with natural ElevenLabs voice.
Includes a lightweight **web dashboard** to view transcripts and audio snippets.

## What this does
- Answers calls with a greeting
- Captures speech using Twilio `<Gather input="speech">`
- Detects intent (book / reschedule / cancel / FAQ / goodbye) with a tiny GPT call
- Generates a short, friendly reply tailored to your fake clinic profile
- Synthesizes voice via **ElevenLabs** and plays it back
- Shows live call transcripts + audio on a simple dashboard

> This is perfect for **client demos**. For streaming, upgrade later to **Twilio Media Streams**.

---

## Quickstart

### 1) Clone + Install
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2) Configure Keys
Copy `.env.example` to `.env` and fill your keys:
```
OPENAI_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # Rachel (default), swap for your chosen voice
```

### 3) Run the server
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
Visit the dashboard at **http://localhost:8000**

### 4) Expose to Twilio (during dev)
```bash
ngrok http 8000
```
Copy the HTTPS URL (e.g., `https://XXXX.ngrok.io`).  
In your Twilio phone number settings, set **Voice & Fax → A CALL COMES IN** to:
```
https://XXXX.ngrok.io/voice/incoming
```

### 5) Call it
Dial your Twilio number. You should hear the greeting and have a short back-and-forth.

---

## Notes & Upgrades

- **Turn-based vs Streaming**: This demo uses `<Gather>` for simplicity. For a more real-time feel, use **Twilio Media Streams** and stream audio to your backend, transcribe with **Whisper**/**Deepgram**, and stream TTS back.
- **Booking integration**: In `draft_reply`, you can add slot checks or connect to a real calendar. The dashboard is a simple starting point.
- **Persistence**: Currently transcripts are in-memory; swap with SQLite/Postgres for persistence.
- **Voices**: Change `ELEVENLABS_VOICE_ID` to any voice you like from ElevenLabs.
- **Safety**: Add call validation (X-Twilio-Signature) in production.

---

## Project Structure
```
.
├── app.py
├── requirements.txt
├── .env.example
├── data/
│   └── faq.json
├── static/              # generated MP3s land here
└── templates/
    └── index.html
```
