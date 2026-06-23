import asyncio
from datetime import datetime, timezone

from fastapi import WebSocket


EVENTS = [
    {"service": "github", "status": "connected", "severity": "info", "message": "GitHub repositories updated", "data": {"repositories": 3}},
    {"service": "prometheus", "status": "healthy", "severity": "info", "message": "Prometheus metrics updated", "data": {"cpu_usage": "43%", "memory_usage": "67%"}},
    {"service": "docker", "status": "healthy", "severity": "info", "message": "Docker containers updated", "data": {"containers_running": 4}},
    {"service": "kubernetes", "status": "healthy", "severity": "info", "message": "Kubernetes pods updated", "data": {"pods_running": 12, "nodes": 3}},
    {"service": "jenkins", "status": "warning", "severity": "warning", "message": "Jenkins build failed", "data": {"last_build_result": "FAILURE", "job": "aegisops-deploy-prod"}},
    {"service": "cloud", "status": "mock", "severity": "info", "message": "Cloud mock resources updated", "data": {"provider": "NCP/AWS mock"}},
    {"service": "argocd", "status": "degraded", "severity": "error", "message": "ArgoCD application is out of sync", "data": {"application": "aegisops-backend", "sync_status": "OutOfSync", "health_status": "Degraded"}},
]


def timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def dashboard_event(index: int) -> dict:
    return {"type": "dashboard_status_changed", **EVENTS[index % len(EVENTS)], "timestamp": timestamp()}


class DashboardEventManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()
        self._task: asyncio.Task | None = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        if not self._task or self._task.done():
            self._task = asyncio.create_task(self._generate_events())

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        if not self.active_connections and self._task and self._task is not asyncio.current_task():
            self._task.cancel()
            self._task = None

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: dict):
        disconnected = []
        for websocket in tuple(self.active_connections):
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(websocket)
        for websocket in disconnected:
            self.active_connections.discard(websocket)

    async def _generate_events(self):
        index = 0
        heartbeat_at = asyncio.get_running_loop().time()
        try:
            while self.active_connections:
                await asyncio.sleep(5)
                if not self.active_connections:
                    break
                await self.broadcast(dashboard_event(index))
                index += 1
                now = asyncio.get_running_loop().time()
                if now - heartbeat_at >= 20:
                    await self.broadcast({"type": "heartbeat", "timestamp": timestamp()})
                    heartbeat_at = now
        except asyncio.CancelledError:
            pass
        finally:
            self._task = None


dashboard_event_manager = DashboardEventManager()
