from pydantic import BaseModel
from datetime import datetime

class DeploymentOut(BaseModel):
    id: int
    name: str
    version: str
    status: str
    created_at: datetime
    class Config: from_attributes = True
