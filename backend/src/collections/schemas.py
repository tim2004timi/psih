from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class CollectionBase(BaseModel):
    name: str


class CollectionCreate(CollectionBase):
    pass


class CollectionUpdatePartial(CollectionBase):
    pass


class Collection(CollectionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class CollectionWithNotes(Collection):
    collection_notes: List["CollectionNote"]


class CollectionNoteBase(BaseModel):
    name: str
    amount: int
    collection_id: int


class CollectionNoteCreate(CollectionNoteBase):
    pass


class CollectionNoteUpdatePartial(CollectionNoteBase):
    name: str | None = None
    amount: int | None = None


class CollectionNote(CollectionNoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
