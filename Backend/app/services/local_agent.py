"""
local_realtime_agent.py — ElevenLabs v2 compatible version
"""

import asyncio
import base64
import json
import os
import queue
import sounddevice as sd
import websockets
from dotenv import load_dotenv
from elevenlabs import ElevenLabs

# -------------------------------------------------------------
# Load environment
# -------------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
load_dotenv(os.path.join(BASE_DIR, ".env"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVEN_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

# Create ElevenLabs client
tts_client = ElevenLabs(api_key=ELEVEN_API_KEY)

# -------------------------------------------------------------
# Config
# -------------------------------------------------------------
MODEL = "gpt-4o-realtime-preview"
SAMPLE_RATE = 16000
CHUNK_SIZE = 1024
mic_queue = queue.Queue()
play_queue = asyncio.Queue()
is_playing_audio = False

# -------------------------------------------------------------
# Microphone capture
# -------------------------------------------------------------
def mic_callback(indata, frames, time, status):
    if status:
        print("🎙️ Mic status:", status)
    mic_queue.put(bytes(indata))

async def record_microphone():
    with sd.RawInputStream(
        samplerate=SAMPLE_RATE,
        blocksize=CHUNK_SIZE,
        dtype="int16",
        channels=1,
        callback=mic_callback,
    ):
        while True:
            await asyncio.sleep(0.01)

# -------------------------------------------------------------
# Stream mic → OpenAI
# -------------------------------------------------------------
async def stream_mic_audio(ws):
    global is_playing_audio
    silence_time = 0

    while True:
        if is_playing_audio:
            await asyncio.sleep(0.05)
            continue

        if not mic_queue.empty():
            chunk = mic_queue.get()
            audio_b64 = base64.b64encode(chunk).decode("utf-8")
            await ws.send(json.dumps({"type": "input_audio_buffer.append", "audio": audio_b64}))
            silence_time = 0
        else:
            silence_time += 0.01
            if silence_time > 1.6:
                await ws.send(json.dumps({"type": "input_audio_buffer.commit"}))
                await ws.send(json.dumps({
                    "type": "response.create",
                    "response": {
                        "modalities": ["audio", "text"],
                        "instructions": "Continue the conversation naturally."
                    }
                }))
                silence_time = 0
        await asyncio.sleep(0.01)

# -------------------------------------------------------------
# ElevenLabs playback (v2 API)
# -------------------------------------------------------------
async def play_audio():
    """Play audio deltas using ElevenLabs TTS (non-streaming fallback)."""
    global is_playing_audio
    print("🎧 ElevenLabs v2 voice playback ready.")

    while True:
        text_to_speak = await play_queue.get()
        is_playing_audio = True

        try:
            # Generate spoken audio from text using ElevenLabs
            response = tts_client.text_to_speech.convert(
                voice_id=ELEVEN_VOICE_ID,
                model_id="eleven_multilingual_v2",
                optimize_streaming_latency="3",
                voice_settings={
                    "stability": 0.45,
                    "similarity_boost": 0.9,
                    "style": 0.4,
                    "use_speaker_boost": True
                },
                text=text_to_speak,  # ✅ correct argument name
            )

            audio_bytes = b"".join(chunk for chunk in response)
            with sd.RawOutputStream(
                samplerate=SAMPLE_RATE,
                blocksize=CHUNK_SIZE,
                dtype="int16",
                channels=1,
            ) as out:
                out.write(audio_bytes)

        except Exception as e:
            print(f"⚠️ ElevenLabs v2 error: {e}")

        is_playing_audio = False

# -------------------------------------------------------------
# Listen to AI responses
# -------------------------------------------------------------
async def listen_to_ai(ws):
    async for message in ws:
        event = json.loads(message)
        etype = event.get("type")

        if etype == "response.audio.delta":
            delta = event.get("delta")
            if delta:
                await play_queue.put(base64.b64decode(delta))

        elif etype == "response.text.delta":
            print(f"💬 AI:", event["delta"], end="", flush=True)

        elif etype == "response.completed":
            print("\n✅ Response complete.\n")

        elif etype == "error":
            print("⚠️ Error:", event.get("error"))

# -------------------------------------------------------------
# Main session
# -------------------------------------------------------------
async def run_conversation():
    uri = f"wss://api.openai.com/v1/realtime?model={MODEL}"
    headers = [
        ("Authorization", f"Bearer {OPENAI_API_KEY}"),
        ("OpenAI-Beta", "realtime=v1"),
    ]

    print("🎧 Connecting to OpenAI Realtime...")
    async with websockets.connect(uri, additional_headers=headers) as ws:
        print("✅ Connected to GPT-4o Realtime session.")

        await ws.send(json.dumps({
            "type": "session.update",
            "session": {
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.8,
                    "silence_duration_ms": 1800,
                    "interrupt_response": True
                }
            }
        }))

        await asyncio.sleep(1.5)
        await ws.send(json.dumps({
            "type": "response.create",
            "response": {
                "modalities": ["audio", "text"],
                "instructions": (
                    "Good afternoon, you’ve reached Smith Dental Clinic. "
                    "My name is Sonva — how can I help you today?"
                )
            }
        }))

        asyncio.create_task(record_microphone())
        asyncio.create_task(stream_mic_audio(ws))
        asyncio.create_task(play_audio())

        print("🤖 Sonva is live — speak naturally. (Ctrl+C to stop)\n")
        await listen_to_ai(ws)

# -------------------------------------------------------------
# Entry
# -------------------------------------------------------------
if __name__ == "__main__":
    try:
        asyncio.run(run_conversation())
    except KeyboardInterrupt:
        print("\n🛑 Conversation ended.")