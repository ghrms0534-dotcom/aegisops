from pydantic import BaseModel

class ContainerOut(BaseModel):
    id: int
    name: str
    image: str
    status: str
    cpu_usage: float
    mem_usage: float
    uptime: str
    class Config: from_attributes = True
