from app.providers.integrations.base import configured, status


class PrometheusProvider:
    def check_status(self) -> dict:
        return status("Prometheus", configured("PROMETHEUS_URL"))
