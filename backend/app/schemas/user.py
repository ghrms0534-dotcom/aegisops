from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Literal

class UserRegister(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    username: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=4, max_length=128)
    role: Literal["viewer", "devops", "admin"] = "viewer"

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    class Config: from_attributes = True
