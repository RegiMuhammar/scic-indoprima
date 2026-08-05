"""Supabase client singleton — digunakan di seluruh backend (auth & data ops)"""
from supabase import create_client, Client
from app.core.config import settings


def _create_supabase_client() -> Client:
    """Inisialisasi Supabase Client menggunakan service role key."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise RuntimeError(
            "SUPABASE_URL dan SUPABASE_SERVICE_KEY wajib diisi di file .env"
        )
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


# Singleton instance — diimport langsung oleh modul lain
supabase: Client = _create_supabase_client()
