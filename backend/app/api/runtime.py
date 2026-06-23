from fastapi import APIRouter

from app.services.dashboard_service import dashboard_service


router = APIRouter()


@router.get("/runtime/health")
def get_runtime_health():
    return dashboard_service.runtime_health()


@router.get("/dashboard/summary")
def get_dashboard_summary():
    return dashboard_service.summary()


@router.get("/dashboard/overview")
def get_dashboard_overview():
    return dashboard_service.overview()


@router.get("/k8s/live/pods")
def get_live_pods():
    return dashboard_service.kubernetes.pods()


@router.get("/docker/live/containers")
def get_live_containers():
    return dashboard_service.docker.containers()


@router.get("/git/live/status")
def get_live_git_status():
    return dashboard_service.git.status()
