from app.providers.integrations.base import configured, status


class ArgoCdProvider:
    def check_status(self) -> dict:
        return status("ArgoCD", configured("ARGOCD_SERVER", "ARGOCD_TOKEN"))
