from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.db.session import Base
from datetime import datetime

class Cluster(Base):
    __tablename__ = "clusters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    region = Column(String)
    status = Column(String) # Online, Offline, degraded
    cpu_usage = Column(Float)
    mem_usage = Column(Float)
    version = Column(String)

class Namespace(Base):
    __tablename__ = "namespaces"
    id = Column(Integer, primary_key=True, index=True)
    cluster_id = Column(Integer, ForeignKey("clusters.id"))
    name = Column(String)

class Pod(Base):
    __tablename__ = "pods"
    id = Column(Integer, primary_key=True, index=True)
    namespace_id = Column(Integer, ForeignKey("namespaces.id"))
    name = Column(String)
    status = Column(String) # Running, Pending, Failed
    restarts = Column(Integer)
    cpu_limit = Column(String)
    mem_limit = Column(String)

class Deployment(Base):
    __tablename__ = "deployments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    namespace_id = Column(Integer, ForeignKey("namespaces.id"))
    version = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
