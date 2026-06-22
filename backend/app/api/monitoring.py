from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/metrics")
def get_system_metrics():
    return {
        "cpu": random.uniform(20.0, 80.0),
        "memory": random.uniform(30.0, 90.0),
        "disk": random.uniform(10.0, 50.0),
        "uptime": "14d 2h 15m",
        "services_healthy": 12,
        "services_total": 14
    }
