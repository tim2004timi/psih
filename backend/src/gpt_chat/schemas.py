from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class GPTMessageBase(BaseModel):
    role: str
    content: str
    user_id: int


class GPTMessageCreate(GPTMessageBase):
    pass


class GPTMessage(GPTMessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime