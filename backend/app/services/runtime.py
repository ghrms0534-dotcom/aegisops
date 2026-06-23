from app.services.dashboard_service import dashboard_service


runtime_health = dashboard_service.runtime_health
dashboard_summary = dashboard_service.summary
kubernetes_pods = dashboard_service.kubernetes.pods
kubernetes_deployments = dashboard_service.kubernetes.deployments
kubernetes_cluster = dashboard_service.kubernetes.cluster
docker_containers = dashboard_service.docker.containers
git_status = dashboard_service.git.status
system_metrics = dashboard_service.system.metrics
