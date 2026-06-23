from fastapi import APIRouter

from app.connectors.jenkins_connector import jenkins_connector


router = APIRouter()


@router.get("/status")
def get_jenkins_status():
    return jenkins_connector.get_status()


@router.get("/jobs")
def get_jenkins_jobs():
    return jenkins_connector.get_jobs()


@router.get("/builds")
def get_jenkins_builds():
    return jenkins_connector.get_builds()


@router.get("/pipelines")
def get_jenkins_pipelines():
    return jenkins_connector.get_pipelines()
