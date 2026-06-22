from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, k8s, docker, deployments, git, monitoring, alerts, admin
from app.db.session import Base, engine, migrate_sqlite_schema
from app.db.seed import seed_db
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3300)
