from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Zenovra Hiring Platform"
    debug: bool = True
    api_prefix: str = "/api/v1"

    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "hiring"

    # Firebase
    firebase_credentials_path: str = ""
    firebase_project_id: str = ""

    # Storage
    storage_backend: str = "local"  # local, s3, firebase
    storage_bucket: str = ""
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    local_storage_path: str = "./uploads"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "https://hiring.zenovra.org", "https://zenovra-hiring.vercel.app"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
