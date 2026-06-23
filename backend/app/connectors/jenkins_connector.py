class JenkinsConnector:
    def get_status(self) -> dict:
        return {
            "service": "jenkins",
            "status": "connected",
            "mode": "mock",
            "base_url": "mock://jenkins",
            "message": "Jenkins connector is running in mock mode",
        }

    def get_jobs(self) -> dict:
        return {"jobs": [
            {"name": "aegisops-backend-build", "status": "success", "last_build": 128, "branch": "main", "duration": "2m 14s"},
            {"name": "aegisops-frontend-build", "status": "running", "last_build": 87, "branch": "develop", "duration": "1m 02s"},
            {"name": "aegisops-deploy-prod", "status": "failed", "last_build": 42, "branch": "main", "duration": "4m 31s"},
        ]}

    def get_builds(self) -> dict:
        return {"builds": [
            {"job": "aegisops-backend-build", "build_number": 128, "result": "SUCCESS", "timestamp": "2026-06-22T09:00:00Z", "duration_ms": 134000},
            {"job": "aegisops-deploy-prod", "build_number": 42, "result": "FAILURE", "timestamp": "2026-06-22T09:30:00Z", "duration_ms": 271000},
        ]}

    def get_pipelines(self) -> dict:
        return {"pipelines": [
            {"name": "backend-ci", "stages": [
                {"name": "Checkout", "status": "success"},
                {"name": "Test", "status": "success"},
                {"name": "Build", "status": "success"},
                {"name": "Deploy", "status": "success"},
            ]},
            {"name": "production-deploy", "stages": [
                {"name": "Checkout", "status": "success"},
                {"name": "Build Image", "status": "success"},
                {"name": "Deploy", "status": "failed"},
            ]},
        ]}


jenkins_connector = JenkinsConnector()
