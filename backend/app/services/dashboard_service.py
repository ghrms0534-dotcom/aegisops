from datetime import datetime, timezone

from app.connectors.jenkins_connector import jenkins_connector
from app.connectors.prometheus_connector import get_metrics
from app.core.config import settings
from app.providers.local_docker_provider import LocalDockerProvider
from app.providers.local_git_provider import LocalGitProvider
from app.providers.local_kubernetes_provider import LocalKubernetesProvider
from app.providers.local_system_provider import LocalSystemProvider
from app.services.cloud_service import cloud_service


class DashboardService:
    def __init__(self, kubernetes=None, docker=None, git=None, system=None):
        self.kubernetes = kubernetes or LocalKubernetesProvider()
        self.docker = docker or LocalDockerProvider()
        self.git = git or LocalGitProvider()
        self.system = system or LocalSystemProvider()

    def runtime_health(self) -> dict:
        return {
            "docker": self.docker.health(),
            "kubectl": self.kubernetes.health(),
            "git": self.git.health(),
        }

    def summary(self) -> dict:
        return {
            "pods": self.kubernetes.pods(),
            "containers": self.docker.containers(),
            "deployments": self.kubernetes.deployments(),
            "system": self.system.metrics(),
            "git": self.git.status(),
            "cluster": self.kubernetes.cluster(),
        }

    def overview(self) -> dict:
        summary = self.summary()
        prometheus = get_metrics()
        jobs = jenkins_connector.get_jobs()["jobs"]
        builds = jenkins_connector.get_builds()["builds"]
        aws = cloud_service.aws_resources()
        ncp = cloud_service.ncp_resources()
        healthy = all(summary[key]["status"] == "ok" for key in ("pods", "containers", "deployments", "system", "git", "cluster"))
        return {
            "status": "healthy" if healthy else "degraded",
            "mode": "mixed",
            "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "summary": summary,
            "services": {
                "github": {"status": "configured" if settings.GITHUB_TOKEN else "not_configured", "repositories": 0},
                "prometheus": prometheus,
                "docker": {"status": summary["containers"]["status"], "containers_running": summary["containers"]["running"]},
                "kubernetes": {"status": summary["pods"]["status"], "pods_running": summary["pods"]["running"], "nodes": summary["cluster"]["nodes"]},
                "jenkins": {"status": "warning" if any(build["result"] == "FAILURE" for build in builds) else "healthy", "jobs_total": len(jobs), "last_build_result": builds[-1]["result"] if builds else "UNKNOWN"},
                "cloud": {"status": "demo", "provider": f'{ncp["provider"]}/{aws["provider"]} demo'},
            },
        }


dashboard_service = DashboardService()
