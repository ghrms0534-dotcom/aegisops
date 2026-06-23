from app.providers.integrations.argocd_provider import ArgoCdProvider
from app.providers.integrations.aws_provider import AwsProvider
from app.providers.integrations.github_actions_provider import GitHubActionsProvider
from app.providers.integrations.grafana_provider import GrafanaProvider
from app.providers.integrations.jenkins_provider import JenkinsProvider
from app.providers.integrations.ncp_provider import NcpProvider
from app.providers.integrations.prometheus_provider import PrometheusProvider


class IntegrationService:
    def __init__(self, providers=None):
        self.providers = providers or [
            NcpProvider(), AwsProvider(), PrometheusProvider(), GrafanaProvider(),
            ArgoCdProvider(), GitHubActionsProvider(), JenkinsProvider(),
        ]

    def statuses(self) -> dict:
        return {"integrations": [provider.check_status() for provider in self.providers]}


integration_service = IntegrationService()
