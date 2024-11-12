from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict, Field, validator, field_validator


class UserBase(BaseModel):
    access_storage: bool | None = False
    access_crm: bool | None = False
    access_message: bool | None = False
    access_analytics: bool | None = False


class UserCreate(UserBase):
    # email: EmailStr
    username: str = Field(
        ...,
        min_length=6,
        max_length=12,
        pattern="^[a-z0-9]+$",
    )
    tg_username: str = Field(...)
    password: str = Field(
        ...,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )

    @field_validator("tg_username")
    def validate_tg_username(cls, value):
        if not value.startswith("@"):
            raise ValueError("tg_username должен начинаться с символа @")
        return value


class UserUpdatePartial(UserBase):
    tg_username: str | None = None
    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )
    access_storage: bool | None = None
    access_crm: bool | None = None
    access_message: bool | None = None
    access_analytics: bool | None = None
    active: bool | None = None

    @field_validator("tg_username")
    def validate_tg_username(cls, value):
        if not value.startswith("@"):
            raise ValueError("tg_username должен начинаться с символа @")
        return value


class UserMeUpdatePartial(BaseModel):
    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=16,
        pattern="^[A-Za-z0-9]+$",
    )


class User(UserBase):
    username: str
    # email: EmailStr
    tg_username: str
    id: int
    created_at: datetime
    admin: bool
    active: bool
    model_config = ConfigDict(from_attributes=True)
