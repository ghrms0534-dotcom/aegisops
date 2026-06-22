from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.cluster import Deployment
from app.schemas.deployment import DeploymentOut

router = APIRouter()

@router.get("/history", response_model=list[DeploymentOut])
def get_deployment_history(db: Session = Depends(get_db)):
    return db.query(Deployment).order_by(Deployment.created_at.desc()).all()

@router.post("/trigger")
def trigger_deployment(app_name: str, version: str, db: Session = Depends(get_db)):
    # Mock trigger - in real world this would call a CI/CD pipeline
    return {"message": f"Deployment of {app_name} version {version} triggered successfully"}
