from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text

from app.db.session import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String, nullable=False)
    agent_type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    current_task = Column(String)
    last_execution = Column(DateTime)
    response_time = Column(Float)


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    workflow_name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    current_step = Column(String)
    duration = Column(Float)
    started_at = Column(DateTime)
    finished_at = Column(DateTime)


class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    command = Column(Text, nullable=False)
    execution_result = Column(Text)
    status = Column(String, nullable=False)
    duration = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class SystemHealth(Base):
    __tablename__ = "system_health"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    latency = Column(Float)
    last_check = Column(DateTime, default=datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
