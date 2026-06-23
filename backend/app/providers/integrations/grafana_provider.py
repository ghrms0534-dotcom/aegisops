from app.providers.integrations.base import configured, status


class GrafanaProvider:
    def check_status(self) -> dict:
        return status("Grafana", configured("GRAFANA_URL", "GRAFANA_API_KEY"))
