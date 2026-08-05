"""Auth router — endpoint terkait profil user yang terautentikasi"""
from fastapi import APIRouter, Depends
from supabase_auth.types import User
from app.auth.dependencies import get_current_user


router = APIRouter()


@router.get("/me", summary="Get current user profile")
async def get_me(current_user: User = Depends(get_current_user)) -> dict:
    """
    Mengembalikan profil user yang sedang login.

    Membutuhkan header: Authorization: Bearer <supabase_access_token>

    Response contoh:
    {
        "id": "uuid",
        "email": "user@indoprima.co.id",
        "role": "authenticated",
        "created_at": "2024-01-01T00:00:00Z"
    }
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "last_sign_in_at": current_user.last_sign_in_at,
        "user_metadata": current_user.user_metadata or {},
    }
