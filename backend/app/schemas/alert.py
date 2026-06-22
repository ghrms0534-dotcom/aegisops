from pydantic import BaseModel

class AlertOut(BaseModel):
    id: int
    severity: str
    message: str
    source: str
    created_at: str
    is_read: bool
    class Config: from_attributes = True
