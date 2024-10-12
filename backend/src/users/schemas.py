from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    username: str
    # email: EmailStr
    tg_username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    admin: bool
    active: bool
    model_config = ConfigDict(from_attributes=True)
