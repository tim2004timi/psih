from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr

from ..database import Base


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(index=True, nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
