from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class BusinessNoteBase(BaseModel):
    name: str
    amount: int
    user_id: int


class BusinessNoteCreate(BusinessNoteBase):
    pass


class BusinessNoteUpdatePartial(BusinessNoteBase):
    name: str | None = None
    amount: int | None = None


class BusinessNote(BusinessNoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
