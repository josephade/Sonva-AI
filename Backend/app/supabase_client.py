# app/supabase_client.py

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env once (Single Responsibility)
load_dotenv()

class SupabaseClient:
    """Handles creation of a single reusable Supabase client instance."""

    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            raise ValueError("Missing Supabase environment variables")

        self.client: Client = create_client(url, key)

    def get_client(self) -> Client:
        """Return the initialized Supabase client."""
        return self.client


# Global instance (Dependency Inversion ready)
supabase = SupabaseClient().get_client()