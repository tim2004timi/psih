from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    access_storage: bool | None = False
    access_crm: bool | None = False
    access_message: bool | None = False
    access_analytics: bool | None = False


class UserCreate(UserBase):
    username: str
    # email: EmailStr
    tg_username: str
    password: str


class UserUpdatePartial(UserBase):
    access_storage: bool | None = None
    access_crm: bool | None = None
    access_message: bool | None = None
    access_analytics: bool | None = None
    active: bool | None = None


class User(UserBase):
    username: str
    # email: EmailStr
    tg_username: str
    id: int
    created_at: datetime
    admin: bool
    active: bool
    model_config = ConfigDict(from_attributes=True)


# class Role(BaseModel):
#     id: int
#     name: str
