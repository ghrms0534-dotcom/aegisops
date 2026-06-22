from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.cluster import Cluster, Namespace, Pod, Deployment
from app.schemas.k8s import ClusterOut, PodOut, NamespaceOut

router = APIRouter()

@router.get("/clusters", response_model=list[ClusterOut])
def get_clusters(db: Session = Depends(get_db)):
    return db.query(Cluster).all()

@router.get("/namespaces", response_model=list[NamespaceOut])
def get_namespaces(db: Session = Depends(get_db)):
    return db.query(Namespace).all()

@router.get("/pods", response_model=list[PodOut])
def get_pods(namespace_id: int, db: Session = Depends(get_db)):
    return db.query(Pod).filter(Pod.namespace_id == namespace_id).all()

@router.post("/pods/{pod_id}/restart")
def restart_pod(pod_id: int, db: Session = Depends(get_db)):
    pod = db.query(Pod).filter(Pod.id == pod_id).first()
    if not pod:
        raise HTTPException(status_code=404, detail="Pod not found")
    pod.restarts += 1
    db.commit()
    return {"message": f"Pod {pod.name} restarted successfully"}
