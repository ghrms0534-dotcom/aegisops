import json

from app.providers.base import ProviderResult, failure, health, run_command, success


class LocalDockerProvider:
    source = "docker"

    def health(self) -> ProviderResult:
        return health(self.source, run_command(["docker", "ps", "--format", "{{json .}}"]))

    def containers(self) -> ProviderResult:
        result = run_command(["docker", "ps", "--format", "{{json .}}"])
        if not result["ok"]:
            return failure(self.source, result["error"], running=0, items=[])
        try:
            raw_items = [json.loads(line) for line in result["stdout"].splitlines() if line]
        except json.JSONDecodeError as exc:
            return failure(self.source, f"응답 파싱 실패: {exc}", running=0, items=[])
        items = [{
            "id": item.get("ID"), "name": item.get("Names"), "image": item.get("Image"),
            "state": item.get("State"), "status_text": item.get("Status"), "ports": item.get("Ports") or "-",
        } for item in raw_items]
        return success(self.source, running=len(items), items=items)
