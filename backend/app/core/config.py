"""Application configuration via Pydantic Settings"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "changeme"

    # CORS — daftar domain frontend yang diizinkan akses backend
    # Development : ["http://localhost:3000"]
    # Production  : ["https://scic-indoprima.vercel.app"]
    # Isi via env var: CORS_ORIGINS=https://scic.vercel.app,https://custom-domain.com
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Support comma-separated string from env var, e.g. CORS_ORIGINS=url1,url2"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

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
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # LangSmith (optional — AI tracing)
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_PROJECT: str = "scic-indoprima"

    # OpenAI (optional — embedding fallback)
    OPENAI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
