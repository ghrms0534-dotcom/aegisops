import json

from app.providers.base import ProviderResult, failure, health, run_command, success


class LocalKubernetesProvider:
    source = "kubectl"

    def _json(self, arguments: list[str]) -> tuple[dict | None, str | None]:
        result = run_command(["kubectl", *arguments, "-o", "json"])
        if not result["ok"]:
            return None, result["error"]
        try:
            return json.loads(result["stdout"]), None
        except json.JSONDecodeError as exc:
            return None, f"응답 파싱 실패: {exc}"

    def health(self) -> ProviderResult:
        return health(self.source, run_command(["kubectl", "config", "current-context"]))

    def pods(self) -> ProviderResult:
        data, error = self._json(["get", "pods", "-A"])
        if error:
            return failure(self.source, error, total=0, running=0, failed=0, items=[])
        items = [{
            "namespace": item["metadata"].get("namespace"), "name": item["metadata"].get("name"),
            "status": item.get("status", {}).get("phase", "Unknown"),
            "restarts": sum(status.get("restartCount", 0) for status in item.get("status", {}).get("containerStatuses", [])),
        } for item in data.get("items", [])]
        return success(
            self.source, total=len(items), running=sum(item["status"] == "Running" for item in items),
            failed=sum(item["status"] == "Failed" for item in items), items=items,
        )

    def deployments(self) -> ProviderResult:
        data, error = self._json(["get", "deployments", "-A"])
        if error:
            return failure(self.source, error, total=0, available=0)
        items = data.get("items", [])
        return success(
            self.source, total=len(items),
            available=sum(item.get("status", {}).get("availableReplicas", 0) >= item.get("spec", {}).get("replicas", 1) for item in items),
        )

    def cluster(self) -> ProviderResult:
        context = run_command(["kubectl", "config", "current-context"])
        nodes, nodes_error = self._json(["get", "nodes"])
        if not context["ok"] or nodes_error:
            return failure(self.source, context["error"] or nodes_error, context=None, nodes=0)
        return success(self.source, context=context["stdout"], nodes=len(nodes.get("items", [])))
