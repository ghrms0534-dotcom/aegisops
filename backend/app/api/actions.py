from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter()


class ActionSimulationRequest(BaseModel):
    actionType: str
    targetType: str
    targetName: str
    namespace: Optional[str] = None


@router.post("/simulate")
def simulate_action(request: ActionSimulationRequest):
    # ponytail: demo safety gate; real mutating commands need a separate audited endpoint.
    return {
        "success": True,
        "mode": "demo" if settings.DEMO_MODE else "safe",
        "executed": False,
        "message": "Demo mode: no real command was executed",
        "actionType": request.actionType,
        "targetType": request.targetType,
        "targetName": request.targetName,
        "namespace": request.namespace,
        "allowRealCommands": settings.ALLOW_REAL_COMMANDS,
    }
