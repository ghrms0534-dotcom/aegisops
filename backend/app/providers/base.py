import shutil
import subprocess
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[3]
COMMAND_TIMEOUT = 8
ProviderResult = dict[str, Any]


def run_command(command: list[str], cwd: Path = PROJECT_ROOT) -> ProviderResult:
    executable = command[0]
    if not shutil.which(executable):
        return {"ok": False, "stdout": "", "error": f"{executable} 명령을 찾을 수 없습니다."}
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=COMMAND_TIMEOUT,
            check=False,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
    except subprocess.TimeoutExpired:
        return {"ok": False, "stdout": "", "error": f"{executable} 조회 시간이 초과되었습니다."}
    except OSError as exc:
        return {"ok": False, "stdout": "", "error": str(exc)}
    return {
        "ok": result.returncode == 0,
        "stdout": result.stdout.strip(),
        "error": (result.stderr or result.stdout).strip() if result.returncode else None,
    }


def success(source: str, **data: Any) -> ProviderResult:
    return {**data, "source": source, "status": "ok", "error": None}


def failure(source: str, error: str | None, **data: Any) -> ProviderResult:
    return {**data, "source": source, "status": "error", "error": error or "조회에 실패했습니다."}


def health(source: str, command_result: ProviderResult) -> ProviderResult:
    return {
        "available": shutil.which(source) is not None,
        "executable": command_result["ok"],
        "status": "ok" if command_result["ok"] else "error",
        "error": command_result["error"],
    }
