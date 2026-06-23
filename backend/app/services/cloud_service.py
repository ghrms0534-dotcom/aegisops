from app.providers.integrations.aws_provider import AwsProvider
from app.providers.integrations.ncp_provider import NcpProvider


class CloudService:
    def __init__(self, ncp=None, aws=None):
        self.ncp = ncp or NcpProvider()
        self.aws = aws or AwsProvider()

    def ncp_resources(self) -> dict:
        return self.ncp.get_resources()

    def aws_resources(self) -> dict:
        return self.aws.get_resources()


cloud_service = CloudService()
