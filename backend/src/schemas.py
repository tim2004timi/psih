from pydantic import BaseModel, ConfigDict

from src.users.schemas import User


class File(BaseModel):
    id: int
    url: str
    image: bool
    size: str | None
    user: User | None
    model_config = ConfigDict(from_attributes=True)


class FileWithoutUser(BaseModel):
    id: int
    url: str
    image: bool
    size: str | None
    model_config = ConfigDict(from_attributes=True)
