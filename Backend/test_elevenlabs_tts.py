import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

text = "Hello there! This is your Dublin dental receptionist speaking from ElevenLabs."

# ElevenLabs TTS endpoint
url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"

headers = {
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json",
}

data = {
    "text": text,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75,
    },
}

# Request TTS audio
print("🔊 Requesting TTS from ElevenLabs...")
response = requests.post(url, headers=headers, json=data)

if response.status_code == 200:
    with open("output.mp3", "wb") as f:
        f.write(response.content)
    print("✅ Audio saved as output.mp3 — play it to hear your voice!")
else:
    print("❌ Request failed:", response.status_code, response.text)