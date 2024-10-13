from pydantic import BaseModel, ConfigDict


class File(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    image: bool
