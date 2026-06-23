from app.providers.integrations.base import configured, status


class JenkinsProvider:
    def check_status(self) -> dict:
        return status("Jenkins", configured("JENKINS_URL", "JENKINS_USER", "JENKINS_TOKEN"))
