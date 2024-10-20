from typing import Optional, List

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from enum import Enum

from ..schemas import File as MyFile


class StatusEnum(str, Enum):
    PROCESSING = "в обработке"
    DELIVERED = "доставлен"
    RETURNED = "возврат"


class OrderBase(BaseModel):
    full_name: str = Field(example="Иванов Иван Иванович")
    status: StatusEnum = StatusEnum.PROCESSING
    tag: str | None = Field(default=None, example=None)
    channel: str | None = None
    address: str
    task: str | None = None
    note: str | None = None
    comment: str | None = None
    storage: str | None = None
    project: str | None = None
    phone_number: str | None = None
    email: EmailStr | None = None

    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "full_name": "Иванов Иван Иванович",
    #             "status": "в обработке",
    #             "tag": None,
    #         }
    #     }

    # products
    # files


class OrderCreate(OrderBase):
    modifications_in_order: List["ModificationInOrderCreateWithoutOrder"] = []


class OrderUpdatePartial(OrderBase):
    full_name: str | None = None
    address: str | None = None
    status: StatusEnum | None = None
    modifications_in_order: List["ModificationInOrderCreateWithoutOrder"] | None = None


class Order(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    messages: str | None
    # summ: int
    order_date: datetime

    modifications_in_order: List["ModificationInOrder"]
    files: List["MyFile"]


class OrderWithoutProducts(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    messages: str | None
    # summ: int
    order_date: datetime


from ..products.schemas import (
    ModificationInOrder,
    ModificationInOrderCreateWithoutOrder,
)
