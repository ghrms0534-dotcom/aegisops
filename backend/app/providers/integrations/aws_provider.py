class AwsProvider:
    def check_status(self) -> dict:
        return {
            "name": "AWS",
            "status": "ok",
            "summary": {"configured": True, "mode": "demo", "live_connection": False},
            "error": None,
        }

    def get_resources(self) -> dict:
        return {
            "provider": "AWS",
            "type": "Cloud Provider",
            "status": "Demo Mode",
            "live_connection": False,
            "region": "ap-northeast-2",
            "ec2": {"total": 5, "running": 4, "stopped": 1},
            "vpcs": 2,
            "subnets": 4,
            "elastic_ips": 1,
            "load_balancers": 1,
            "eks_clusters": 0,
            "last_sync": "Demo data",
            "note": "Demo Provider - No Live AWS Connection",
        }
