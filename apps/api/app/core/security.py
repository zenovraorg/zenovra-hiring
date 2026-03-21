from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import get_settings

security = HTTPBearer()

async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify Firebase ID token. In dev mode without Firebase, returns a demo user."""
    token = credentials.credentials
    settings = get_settings()

    if settings.debug and token == "demo-token":
        return {
            "uid": "demo-uid",
            "email": "sarah.chen@zenovra.com",
            "name": "Sarah Chen",
        }

    try:
        import firebase_admin.auth as firebase_auth
        decoded = firebase_auth.verify_id_token(token)
        return decoded
    except Exception:
        if settings.debug:
            return {
                "uid": "demo-uid",
                "email": "sarah.chen@zenovra.com",
                "name": "Sarah Chen",
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
