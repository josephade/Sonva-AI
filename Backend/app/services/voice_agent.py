"""
AI Receptionist — Live Two-Way Voice Demo
-----------------------------------------
Streams LiveKit audio to OpenAI Realtime and plays AI voice
responses back into the same LiveKit room.

Features:
- Two-way streaming (listen + talk)
- Barge-in ready (interrupt when user speaks)
- GPT-4o Realtime + voice="alloy"
"""

import asyncio
import base64
import json
import os
import jwt
import signal
import websockets
from dotenv import load_dotenv
from livekit import rtc, api
from datetime import datetime


# -------------------------------------------------------------
# Load environment variables
# -------------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

SYSTEM_PROMPT = """
You are an AI receptionist for a Dublin dental clinic.
Speak in a warm, friendly Irish accent.
Be polite, concise, and natural.
Handle bookings, reschedules, or cancellations clearly.
If you’re unsure, ask a clarifying question.
"""


class VoiceAgent:
    def __init__(self):
        self.model = "gpt-4o-realtime-preview"
        self.voice = "alloy"
        self.room = None
        self.ws = None
        self.running = True
        print("🧠 AI VoiceAgent initialized.")

    # ---------------------------------------------------------
    async def run(self, room_name: str = "demo-room"):
        print(f"🕐 Launching AI Receptionist at {datetime.now():%H:%M:%S}")
        print(f"🚀 Starting VoiceAgent in room '{room_name}'")

        # --- LiveKit token ---
        token = (
            api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
            .with_identity("ai-receptionist")
            .with_name("AI Receptionist")
            .with_grants(api.VideoGrants(
                room_join=True, room=room_name,
                can_publish=True, can_subscribe=True, can_publish_data=True
            ))
            .to_jwt()
        )
        decoded = jwt.decode(token, options={"verify_signature": False})
        print(f"🔐 LiveKit token created for: {decoded['name']}")

        # --- Connect LiveKit ---
        self.room = rtc.Room()

        @self.room.on("track_subscribed")
        def on_audio(track, pub, participant):
            if track.kind == rtc.TrackKind.KIND_AUDIO:
                print(f"🎧 Subscribed to audio from {participant.identity}")
                asyncio.create_task(self.stream_audio_to_openai(track))

        await self.room.connect(LIVEKIT_URL, token)
        print(f"✅ Connected to LiveKit room: {room_name}")

        # --- Connect OpenAI ---
        await self.connect_openai()

        # --- Stay alive until Ctrl+C ---
        print("🎤 Voice agent active. Listening and speaking...")
        try:
            while self.running:
                await asyncio.sleep(0.5)
        finally:
            await self.shutdown()

    # ---------------------------------------------------------
    async def connect_openai(self):
        uri = f"wss://api.openai.com/v1/realtime?model={self.model}"
        headers = [
            ("Authorization", f"Bearer {OPENAI_API_KEY}"),
            ("OpenAI-Beta", "realtime=v1"),
        ]
        self.ws = await websockets.connect(uri, additional_headers=headers)
        print("✅ Connected to OpenAI Realtime session.")

        await self.send_event({
            "type": "session.update",
            "session": {
                "voice": self.voice,
                "instructions": SYSTEM_PROMPT,
                "turn_detection": {"type": "server_vad"},
            },
        })

        asyncio.create_task(self.listen_to_openai())

    # ---------------------------------------------------------
    async def stream_audio_to_openai(self, track):
        print("📡 Streaming participant audio to OpenAI...")
        async for frame in track:
            if not self.ws:
                continue
            audio_b64 = base64.b64encode(frame.data).decode("utf-8")
            try:
                await self.send_event({
                    "type": "input_audio_buffer.append",
                    "audio": audio_b64
                })
            except Exception as e:
                print("⚠️ Error sending audio chunk:", e)

        await self.send_event({"type": "input_audio_buffer.commit"})
        await self.send_event({
            "type": "response.create",
            "response": {
                "modalities": ["audio"],
                "instructions": SYSTEM_PROMPT,
            },
        })

    # ---------------------------------------------------------
    async def listen_to_openai(self):
        print("👂 Listening for OpenAI Realtime events...")
        try:
            while self.running and self.ws:
                msg = await self.ws.recv()
                event = json.loads(msg)
                t = event.get("type")

                if t == "response.audio.delta":
                    delta = event.get("delta")
                    if delta:
                        await self.play_audio_to_livekit(base64.b64decode(delta))
                elif t == "response.text.delta":
                    print(f"💬 AI: {event['delta']}", end="", flush=True)
                elif t == "response.completed":
                    print("\n✅ Response completed.\n")
                elif t == "error":
                    print(f"⚠️ OpenAI error: {event.get('error')}")
        except asyncio.CancelledError:
            pass
        except Exception as e:
            if self.running:
                print(f"⚠️ OpenAI connection error: {e}")

    # ---------------------------------------------------------
    async def play_audio_to_livekit(self, audio_bytes: bytes):
        """Play decoded PCM audio to LiveKit as AI speech."""
        try:
            source = rtc.AudioSource()
            self.room.local_participant.publish_track(source)
            await source.capture_frame(audio_bytes)
        except Exception as e:
            print(f"⚠️ Audio playback error: {e}")

    # ---------------------------------------------------------
    async def send_event(self, payload: dict):
        if self.ws:
            await self.ws.send(json.dumps(payload))

    # ---------------------------------------------------------
    async def shutdown(self):
        if not self.running:
            return
        self.running = False
        print("\n👋 Shutting down...")

        try:
            if self.ws and not self.ws.closed:
                await self.ws.close()
        except Exception as e:
            print(f"⚠️ WS close error: {e}")

        try:
            if self.room:
                await self.room.disconnect()
        except Exception as e:
            print(f"⚠️ LiveKit disconnect error: {e}")

        print("✅ Shutdown complete.")


# -------------------------------------------------------------
# Entry Point
# -------------------------------------------------------------
async def _main():
    agent = VoiceAgent()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(agent.shutdown()))
    await agent.run("demo-room")


if __name__ == "__main__":
    asyncio.run(_main())