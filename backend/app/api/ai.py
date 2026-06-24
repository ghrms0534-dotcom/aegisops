import json
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.services.ollama_service import OllamaConnectionError, analyze_with_ollama

router = APIRouter()


class AnalyzeRequest(BaseModel):
    message: str | None = None
    prompt: str | None = None
    context: dict[str, Any] | None = None
    history: list[dict[str, str]] | None = None


def build_prompt(message: str, context: dict[str, Any] | None, history: list[dict[str, str]] | None = None) -> str:
    context_text = json.dumps(context or {}, ensure_ascii=False, indent=2)
    history_text = json.dumps((history or [])[-8:], ensure_ascii=False, indent=2)
    return f"""You are AegisOps, an InfraOps AI operator assistant.
Do not merely summarize dashboard data. Use it to make an operational judgment.
Always answer with these sections:
1. Risk level
2. Probable root cause
3. Recommended actions
4. What to verify next

Recent conversation memory:
{history_text}

Current AegisOps dashboard state:
{context_text}

User question:
{message}

Rules:
- Use the recent conversation memory to understand follow-up questions.
- Use CURRENT dashboard state as the source of truth.
- If data is missing from the dashboard context, say it is not available.
- Do not invent Kubernetes, Docker, GitHub, or Prometheus facts.
- Do not suggest executing destructive commands."""


@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    message = (request.message or request.prompt or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    prompt = build_prompt(message, request.context, request.history)
    print("=== AI REQUEST ===")
    print("MODEL:", settings.OLLAMA_MODEL)
    print("PROMPT:", message)
    print("DEMO_MODE:", settings.DEMO_MODE)

    try:
        return {"result": analyze_with_ollama(prompt)}
    except OllamaConnectionError:
        raise HTTPException(status_code=503, detail="AI 모델 서버에 연결할 수 없습니다.")
