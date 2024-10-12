from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from pathlib import Path


UPLOAD_DIR = "./static/uploads"
BASE_DIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    db_user: str
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_echo: bool
    bot_token: str
    # salt: str

    model_config = SettingsConfigDict(env_file=".env")


class AuthSettings(BaseModel):
    algorithm: str = "RS256"
    private_key_path: Path = BASE_DIR / "certs" / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / "certs" / "jwt-public.pem"
    access_token_expire_minutes: int = 5  # TODO: изменить
    refresh_token_expire_days: int = 1


settings = Settings()
auth_settings = AuthSettings()
