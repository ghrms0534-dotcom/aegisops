from app.providers.base import ProviderResult, failure, health, run_command, success


class LocalGitProvider:
    source = "git"

    def health(self) -> ProviderResult:
        return health(self.source, run_command(["git", "status", "--porcelain"]))

    def status(self) -> ProviderResult:
        status = run_command(["git", "status", "--porcelain"])
        branch = run_command(["git", "branch", "--show-current"])
        remotes = run_command(["git", "remote", "-v"])
        commit = run_command(["git", "log", "-1", "--pretty=%h %s"])
        error = next((result["error"] for result in (status, branch, remotes, commit) if not result["ok"]), None)
        if error:
            return failure(self.source, error, branch=None, modified_files=0, files=[], remotes=[])
        files = [line for line in status["stdout"].splitlines() if line]
        return success(
            self.source, branch=branch["stdout"] or "detached", modified_files=len(files),
            files=files, remotes=remotes["stdout"].splitlines(), recent_commit=commit["stdout"],
        )
