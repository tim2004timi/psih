from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime


class OrderBase(BaseModel):
    full_name: str
    status: str | None = None
    tag: str | None = None
    channel: str | None = None
    address: str
    task: str | None = None
    note: str | None = None
    comment: str | None = None
    storage: str | None = None
    project: str | None = None
    phone_number: str | None = None
    email: EmailStr | None = None

    # products
    # files


class OrderCreate(OrderBase):
    pass


class OrderUpdatePartial(OrderBase):
    full_name: str | None = None
    address: str | None = None


class ProfileDelete(BaseModel):
    id: int


class Order(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    messages: str | None
    summ: int
    order_date: datetime
