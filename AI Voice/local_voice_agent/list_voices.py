from elevenlabs import ElevenLabs
import os
from dotenv import load_dotenv

load_dotenv()
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

if not ELEVEN_API_KEY:
    print("❌ ELEVEN_API_KEY missing from .env")
    exit()

client = ElevenLabs(api_key=ELEVEN_API_KEY)

voices = client.voices.get_all()

print("\n🎤 Available ElevenLabs Voices:\n")
for v in voices.voices:
    print(f"- {v.name} (id: {v.voice_id})")
