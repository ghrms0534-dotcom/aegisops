class NcpProvider:
    def check_status(self) -> dict:
        return {
            "name": "NCP",
            "status": "ok",
            "summary": {"configured": True, "mode": "mock", "live_connection": False},
            "error": None,
        }

    def get_resources(self) -> dict:
        return {
            "provider": "NCP",
            "type": "Cloud Provider",
            "status": "Mock Mode",
            "live_connection": False,
            "region": "KR-2",
            "servers": {"total": 3, "running": 2, "stopped": 1},
            "vpcs": 1,
            "subnets": 2,
            "public_ips": 1,
            "load_balancers": 0,
            "last_sync": "Mock data",
            "note": "Demo Provider - No Live NCP Connection",
        }
