from livekit import api
from dotenv import load_dotenv
import os
from datetime import timedelta

# Load .env from root
load_dotenv()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

print(f"🔑 LIVEKIT_API_KEY: {LIVEKIT_API_KEY}")
print(f"🧩 LIVEKIT_API_SECRET: {LIVEKIT_API_SECRET[:6]}********")

try:
    token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    token.with_identity("test-user")
    token.with_ttl(timedelta(hours=1))
    token.with_grants(api.VideoGrants(room_join=True, room="demo-room"))

    jwt = token.to_jwt()
    print("\n✅ Generated JWT successfully:")
    print(jwt)
except Exception as e:
    print(f"❌ Error generating JWT: {e}")