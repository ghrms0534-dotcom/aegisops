from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.models.cluster import Cluster, Namespace, Pod, Deployment
from app.models.container import Container, Alert, AuditLog
from app.models.operations import Agent, Workflow, Execution, SystemHealth, Event  # Register tables in Base metadata.
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # Seed Users
    if not db.query(User).first():
        admin = User(
            username="admin", 
            email="admin@aegisops.local",
            hashed_password=get_password_hash("admin123"), 
            full_name="System Admin", 
            role=UserRole.ADMIN
        )
        dev = User(
            username="dev", 
            email="dev@aegisops.local",
            hashed_password=get_password_hash("dev123"), 
            full_name="DevOps Engineer", 
            role=UserRole.DEVOPS
        )
        viewer = User(
            username="viewer", 
            email="viewer@aegisops.local",
            hashed_password=get_password_hash("view123"), 
            full_name="Guest Viewer", 
            role=UserRole.VIEWER
        )
        db.add_all([admin, dev, viewer])
        
        # Seed Clusters
        c1 = Cluster(name="prod-us-east", region="us-east-1", status="Online", cpu_usage=45.2, mem_usage=61.0, version="1.28.2")
        c2 = Cluster(name="staging-eu-west", region="eu-west-1", status="Degraded", cpu_usage=88.5, mem_usage=92.1, version="1.27.0")
        db.add_all([c1, c2])
        db.commit()
        
        # Seed Namespaces
        n1 = Namespace(cluster_id=c1.id, name="production")
        n2 = Namespace(cluster_id=c1.id, name="monitoring")
        n3 = Namespace(cluster_id=c2.id, name="staging")
        db.add_all([n1, n2, n3])
        db.commit()
        
        # Seed Pods
        p1 = Pod(namespace_id=n1.id, name="api-gateway-v1", status="Running", restarts=0, cpu_limit="500m", mem_limit="512Mi")
        p2 = Pod(namespace_id=n1.id, name="auth-service-a", status="Running", restarts=2, cpu_limit="200m", mem_limit="256Mi")
        p3 = Pod(namespace_id=n3.id, name="web-app-staging", status="Failed", restarts=15, cpu_limit="1000m", mem_limit="1Gi")
        db.add_all([p1, p2, p3])
        
        # Seed Containers
        con1 = Container(name="redis-main", image="redis:7.0", status="Running", cpu_usage=1.2, mem_usage=128.0, uptime="45d 12h")
        con2 = Container(name="postgres-db", image="postgres:15", status="Running", cpu_usage=4.5, mem_usage=512.0, uptime="120d 4h")
        con3 = Container(name="legacy-worker", image="worker:old", status="Stopped", cpu_usage=0.0, mem_usage=0.0, uptime="0s")
        db.add_all([con1, con2, con3])
        
        # Seed Alerts
        a1 = Alert(severity="Critical", message="API Gateway high latency > 500ms", source="prod-us-east")
        a2 = Alert(severity="Warning", message="Staging cluster node memory pressure", source="staging-eu-west")
        a3 = Alert(severity="Info", message="Scheduled backup started", source="system")
        db.add_all([a1, a2, a3])
        
        db.commit()
    db.close()
