from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, k8s, docker, deployments, git, monitoring, alerts, admin, runtime, integrations, cloud, github, prometheus, jenkins
from app.db.session import Base, engine, migrate_sqlite_schema
from app.db.seed import seed_db
from app.websocket.dashboard_events import dashboard_event_manager, timestamp
import uvicorn

app = FastAPI(title="AegisOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
Base.metadata.create_all(bind=engine)
migrate_sqlite_schema()
seed_db()

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(k8s.router, prefix="/api/k8s", tags=["K8s"])
app.include_router(docker.router, prefix="/api/docker", tags=["Docker"])
app.include_router(deployments.router, prefix="/api/deployments", tags=["Deployments"])
app.include_router(git.router, prefix="/api/git", tags=["Git"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Monitoring"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(runtime.router, prefix="/api", tags=["Runtime"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrations"])
app.include_router(cloud.router, prefix="/api/cloud", tags=["Cloud"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(prometheus.router, prefix="/api/prometheus", tags=["Prometheus"])
app.include_router(jenkins.router, prefix="/api/jenkins", tags=["Jenkins"])

@app.get("/")
async def root():
    return {"message": "AegisOps API is running"}

@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            import asyncio
            import random
            logs = [
                "INFO: Pod k8s-api-7f8d deployed successfully",
                "WARN: Memory usage high on node-04",
                "ERROR: Connection timeout from service-ingress",
                "INFO: Container docker-redis-cache restarted",
                "INFO: Deployment v1.2.4 pushed to production"
            ]
            await websocket.send_text(random.choice(logs))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        print("Client disconnected from logs")

@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await dashboard_event_manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            if message == "ping":
                await dashboard_event_manager.send_personal_message({"type": "pong", "timestamp": timestamp()}, websocket)
    except WebSocketDisconnect:
        pass
    finally:
        dashboard_event_manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
