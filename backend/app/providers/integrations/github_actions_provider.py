from app.providers.integrations.base import configured, status


class GitHubActionsProvider:
    def check_status(self) -> dict:
        return status("GitHub Actions", configured("GITHUB_TOKEN", "GITHUB_REPOSITORY"))
