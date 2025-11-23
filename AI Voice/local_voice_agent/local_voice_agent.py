import os
import time
import numpy as np
import sounddevice as sd
import wavio
from dotenv import load_dotenv
from openai import OpenAI
# from elevenlabs import ElevenLabs, stream, VoiceSettings
from pathlib import Path
from elevenlabs import ElevenLabs, VoiceSettings, stream, play_audio_stream


# ===============================
# 1️⃣ Load environment variables
# ===============================
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

if not OPENAI_API_KEY or not ELEVEN_API_KEY:
    print("❌ Missing API keys. Make sure both OPENAI_API_KEY and ELEVEN_API_KEY are set in .env.")
    exit()

client = OpenAI(api_key=OPENAI_API_KEY)
voice_client = ElevenLabs(api_key=ELEVEN_API_KEY)

# ===============================
# 2️⃣ Settings
# ===============================
RATE = 44100  # sample rate
OUTPUT_DIR = Path(__file__).parent / "output_audio"
OUTPUT_DIR.mkdir(exist_ok=True)

# ===============================
# 3️⃣ Record audio with silence detection
# ===============================
def record_audio():
    print("\n🎙️ Recording... speak now!")

    silence_threshold = 700     # slightly higher sensitivity
    silence_duration = 1.2
    frame_duration = 0.1
    RATE = 48000                # match Whisper’s ideal input
    buffer = []
    silence_counter = 0

    while True:
        frame = sd.rec(int(frame_duration * RATE), samplerate=RATE, channels=1, dtype="int16")
        sd.wait()
        buffer.append(frame)
        volume = np.abs(frame).mean()

        if volume < silence_threshold:
            silence_counter += frame_duration
            if silence_counter >= silence_duration and len(buffer) > 10:
                break
        else:
            silence_counter = 0

    audio = np.concatenate(buffer, axis=0)

    # Normalize volume to improve clarity
    audio = (audio / np.max(np.abs(audio))) * 32767
    audio = audio.astype("int16")

    print("✅ Recorded.")
    temp_path = OUTPUT_DIR / "input.wav"
    wavio.write(str(temp_path), audio, RATE, sampwidth=2)
    return temp_path


# ===============================
# 4️⃣ Transcribe to text (English only)
# ===============================
def transcribe_audio(file_path):
    try:
        with open(file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=audio_file,
                language="en"  # force English
            )
        return transcript.text.strip()
    except Exception as e:
        print(f"⚠️ Transcription error: {e}")
        return None

# ===============================
# 5️⃣ Generate GPT response
# ===============================
def generate_response(user_text):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Grace, a friendly and professional dental receptionist. "
                        "Speak warmly and conversationally, as if talking to a real patient. "
                        "Keep answers short, clear, and kind."
                    )
                },
                {"role": "user", "content": user_text}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"⚠️ GPT error: {e}")
        return "Sorry, something went wrong while generating my reply."

# ===============================
# 6️⃣ Speak response using ElevenLabs (streaming)
# ===============================
def speak_text(text):
    try:
        print("\n🔊 Speaking...")

        voice_id = "21m00Tcm4TlvDq8ikWAM"  # replace with your chosen voice ID

        # Create the audio stream directly
        audio_stream = voice_client.text_to_speech.stream(
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            text=text,
            voice_settings=VoiceSettings(stability=0.5, similarity_boost=0.9)
        )

        # ✅ Use ElevenLabs built-in player for streams
        play_audio_stream(audio_stream)

    except Exception as e:
        print(f"⚠️ Speech error: {e}")



# ===============================
# 7️⃣ Main loop
# ===============================
def main():
    print("\n💬 Local AI Receptionist ready! Speak naturally — I’ll stop listening when you pause. Press Ctrl+C to quit.\n")

    while True:
        try:
            input_file = record_audio()
            text = transcribe_audio(input_file)
            if not text:
                continue

            print(f"\n🗣️ You said: {text}")
            reply = generate_response(text)
            print(f"🤖 AI: {reply}")

            speak_text(reply)

        except KeyboardInterrupt:
            print("\n👋 Exiting gracefully.")
            break
        except Exception as e:
            print(f"⚠️ Unexpected error: {e}")
            break


if __name__ == "__main__":
    main()
