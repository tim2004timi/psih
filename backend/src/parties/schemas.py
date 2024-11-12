from typing import Optional, List

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from enum import Enum

from ..schemas import File as MyFile
from ..products.schemas import ModificationInPartyBase, Modification


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
    overheads: int


class PartyCreate(PartyBase):
    modifications_in_party: List["ModificationInPartyCreateWithoutParty"] = []


class PartyUpdatePartial(PartyBase):
    agent_name: str | None = None
    status: StatusEnum | None = None
    overheads: int | None = None
    modifications_in_party: List["ModificationInPartyCreateWithoutParty"] | None = None


class Party(PartyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    party_date: datetime
    modifications_in_party: List["ModificationInParty"]
    files: List["MyFile"]


class PartyWithoutProducts(PartyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    party_date: datetime
    # files: List["MyFile"]


class ModificationInPartyCreateWithoutParty(ModificationInPartyBase):
    modification_id: int


class ModificationInParty(ModificationInPartyBase):
    model_config = ConfigDict(from_attributes=True)

    modification: "Modification"
    id: int
