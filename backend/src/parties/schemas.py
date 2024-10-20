from typing import Optional, List

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from enum import Enum

from ..schemas import File as MyFile


class StatusEnum(str, Enum):
    ON_STORAGE = "на складе"


class PartyBase(BaseModel):
    agent_name: str = Field(example="Иванов Иван Иванович")
    status: StatusEnum = StatusEnum.ON_STORAGE
    tag: str | None = None
    note: str | None = None
    storage: str | None = None
    project: str | None = None
    phone_number: str | None = None


class PartyCreate(PartyBase):
    modifications_in_party: List["ModificationsInPartyCreateWithoutParty"] = []


class PartyUpdatePartial(PartyBase):
    agent_name: str | None = None
    status: StatusEnum | None = None
    modifications_in_party: List["ModificationsInPartyCreateWithoutParty"] | None = None


class Party(PartyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    party_date: datetime
    modifications_in_order: List["ModificationsInParty"]
    files: List["MyFile"]


class PartyWithoutProducts(PartyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    party_date: datetime
    files: List["MyFile"]


class ModificationsInPartyCreateWithoutParty:
    pass
