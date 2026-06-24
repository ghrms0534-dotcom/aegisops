from fastapi import APIRouter
from pydantic import BaseModel

class RepoInfo(BaseModel):
    name: str
    branch: str
    last_commit: str
    pr_status: str

router = APIRouter()

# Demo data since Git is external
MOCK_REPOS = [
    {"name": "aegis-core", "branch": "main", "last_commit": "feat: add k8s orchestrator", "pr_status": "Open"},
    {"name": "aegis-frontend", "branch": "develop", "last_commit": "fix: sidebar layout", "pr_status": "Merged"},
    {"name": "infra-terraform", "branch": "main", "last_commit": "update aws region", "pr_status": "None"},
]

@router.get("/repositories")
def get_repositories():
    return MOCK_REPOS
