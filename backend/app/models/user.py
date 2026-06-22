from sqlalchemy import Column, Integer, String, Enum, Boolean
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    DEVOPS = "DevOps Engineer"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
