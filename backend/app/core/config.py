from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AegisOps"
    SECRET_KEY: str = "aegis-super-secret-key-for-dev-only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "sqlite:///./aegisops.db"
    GITHUB_TOKEN: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
