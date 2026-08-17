"""Application configuration via Pydantic Settings"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "changeme"

    # CORS — daftar domain frontend yang diizinkan akses backend
    # Development : http://localhost:3000
    # Production  : https://scic-indoprima.vercel.app
    # Multiple   : https://scic.vercel.app,https://custom-domain.com
    # Simpan sebagai string biasa; validator di bawah mengubahnya ke List[str]
    CORS_ORIGINS: str = "http://localhost:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v) -> str:
        """Normalise ke string; split dilakukan di property cors_origins_list."""
        if isinstance(v, list):
            return ",".join(v)
        return str(v)

    @property
    def cors_origins_list(self) -> List[str]:
        """Gunakan property ini di middleware CORS FastAPI."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    DATABASE_URL: str = ""

    # MotherDuck
    MOTHERDUCK_TOKEN: str = ""
    MOTHERDUCK_DB: str = "scic_analytics"

    # Upstash Redis
    UPSTASH_REDIS_URL: str = ""
    UPSTASH_REDIS_TOKEN: str = ""

    # ARQ Background Jobs
    ARQ_REDIS_URL: str = ""

    # Pinecone
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "scic-indoprima"
    PINECONE_ENVIRONMENT: str = "us-east-1-aws"

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # AI Agent Runtime Controls
    SQL_QUERY_TIMEOUT_SECONDS: int = 8
    SQL_MAX_ROWS_LIMIT: int = 1000
    AGENT_MAX_SQL_RETRIES: int = 3
    AGENT_MAX_EXPERT_RETRIES: int = 2

    # LangSmith (optional — AI tracing)
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_PROJECT: str = "scic-indoprima"

    # OpenAI (optional — embedding fallback)
    OPENAI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
