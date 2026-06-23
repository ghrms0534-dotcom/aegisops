import os


def configured(*variables: str) -> bool:
    return all(os.getenv(variable) for variable in variables)


def status(name: str, is_configured: bool) -> dict:
    if not is_configured:
        return {"name": name, "status": "not_configured", "summary": {"configured": False}, "error": None}
    return {
        "name": name,
        "status": "unavailable",
        "summary": {"configured": True},
        "error": "연결 검증은 현재 단계에서 비활성화되어 있습니다.",
    }
