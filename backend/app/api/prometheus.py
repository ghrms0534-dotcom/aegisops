from fastapi import APIRouter

from app.connectors.prometheus_connector import get_metrics


router = APIRouter()


@router.get("/metrics")
def get_prometheus_metrics():
    return get_metrics()
