"""FastAPI auth dependencies — JWT verification via Supabase"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase_auth.types import User, UserResponse
from app.auth.supabase_client import supabase

# HTTPBearer scheme — mengekstrak token dari header: Authorization: Bearer <token>
_bearer_scheme = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> User:
    """
    Dependency FastAPI — memverifikasi Bearer JWT token via Supabase Auth.

    Penggunaan:
        @router.get("/protected")
        async def protected_route(user: User = Depends(get_current_user)):
            return {"user_id": user.id}

    Raises:
        HTTPException 401 — jika token tidak valid atau sudah expired.
    """
    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
        user = response.user
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token tidak valid atau sudah expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi gagal. Silakan login ulang.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
