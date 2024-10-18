from pydantic import BaseModel, ConfigDict

from src.users.schemas import User


class File(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    image: bool
    size: str | None
    user: User | None
