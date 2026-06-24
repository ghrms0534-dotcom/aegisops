import json
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

from app.core.config import settings


class OllamaConnectionError(Exception):
    pass


def analyze_with_ollama(prompt: str) -> str:
    url = settings.OLLAMA_BASE_URL.rstrip("/") + "/api/generate"
    body = json.dumps({
        "model": settings.OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }).encode("utf-8")
    request = Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urlopen(request, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (URLError, HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        raise OllamaConnectionError from exc
    return payload.get("response", "").strip()
