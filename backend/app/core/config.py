from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AegisOps"
    SECRET_KEY: str = "aegis-super-secret-key-for-dev-only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "sqlite:///./aegisops.db"
    GITHUB_TOKEN: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:3b"
    DEMO_MODE: bool = True
    ALLOW_REAL_COMMANDS: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
