from fastapi import APIRouter, Depends
from app.core.security import verify_firebase_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
async def get_current_user(token: dict = Depends(verify_firebase_token)):
    return {
        "uid": token.get("uid"),
        "email": token.get("email"),
        "name": token.get("name", ""),
    }
