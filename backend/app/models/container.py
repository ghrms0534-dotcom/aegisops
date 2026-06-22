from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from app.db.session import Base
from datetime import datetime

class Container(Base):
    __tablename__ = "containers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    status = Column(String) # Running, Stopped, Paused
    cpu_usage = Column(Float)
    mem_usage = Column(Float)
    uptime = Column(String)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String) # Critical, Warning, Info
    message = Column(String)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    target = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String)
