from fastapi import APIRouter

from app.services.cloud_service import cloud_service


router = APIRouter()


@router.get("/ncp")
def get_ncp_resources():
    return cloud_service.ncp_resources()


@router.get("/aws")
def get_aws_resources():
    return cloud_service.aws_resources()
