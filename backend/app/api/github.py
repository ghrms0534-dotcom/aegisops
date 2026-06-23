from fastapi import APIRouter

from app.core.config import settings
from app.services.github_service import get_github_repository_count, validate_github_token


router = APIRouter()


@router.get("/status")
def get_github_status():
    if not settings.GITHUB_TOKEN:
        return {"status": "Not Configured", "connected": False, "repositories": 0}
    connected = validate_github_token()
    if not connected:
        return {"status": "Authentication Failed", "connected": False, "repositories": 0}
    return {"status": "Connected", "connected": True, "repositories": get_github_repository_count()}


@router.get("/repos")
def get_github_repositories():
    return {"count": get_github_repository_count()}
