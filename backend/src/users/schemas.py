from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class AdminBase(BaseModel):
    username: str
    email: EmailStr


class AdminCreate(AdminBase):
    password: str


class Admin(AdminBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
