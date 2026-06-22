from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.container import Container
from app.schemas.docker import ContainerOut

router = APIRouter()

@router.get("/containers", response_model=list[ContainerOut])
def get_containers(db: Session = Depends(get_db)):
    return db.query(Container).all()

@router.patch("/containers/{container_id}/status")
def update_container_status(container_id: int, status: str, db: Session = Depends(get_db)):
    container = db.query(Container).filter(Container.id == container_id).first()
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
    container.status = status
    db.commit()
    return {"message": f"Container {container.name} updated to {status}"}
