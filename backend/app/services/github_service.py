import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.core.config import settings


API_URL = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
    "User-Agent": "AegisOps",
}


def _get(path: str, query: dict | None = None):
    url = f"{API_URL}{path}"
    if query:
        url = f"{url}?{urlencode(query)}"
    request = Request(url, headers={**HEADERS, "Authorization": f"Bearer {settings.GITHUB_TOKEN}"})
    with urlopen(request, timeout=8) as response:
        return json.load(response)


def validate_github_token() -> bool:
    if not settings.GITHUB_TOKEN:
        return False
    try:
        _get("/user")
        return True
    except (HTTPError, URLError, TimeoutError, OSError, ValueError):
        return False


def get_github_repository_count() -> int:
    if not settings.GITHUB_TOKEN:
        return 0
    count = 0
    try:
        page = 1
        while True:
            repositories = _get("/user/repos", {"per_page": 100, "page": page})
            count += len(repositories)
            if len(repositories) < 100:
                break
            page += 1
    except (HTTPError, URLError, TimeoutError, OSError, ValueError, TypeError):
        return 0
    return count
