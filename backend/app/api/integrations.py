from fastapi import APIRouter

from app.services.integration_service import integration_service


router = APIRouter()


@router.get("/status")
def get_integration_status():
    return integration_service.statuses()
