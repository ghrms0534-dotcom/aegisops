from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClusterOut(BaseModel):
    id: int
    name: str
    region: str
    status: str
    cpu_usage: float
    mem_usage: float
    version: str
    class Config: from_attributes = True

class NamespaceOut(BaseModel):
    id: int
    name: str
    cluster_id: int
    class Config: from_attributes = True

class PodOut(BaseModel):
    id: int
    name: str
    status: str
    restarts: int
    cpu_limit: str
    mem_limit: str
    class Config: from_attributes = True
