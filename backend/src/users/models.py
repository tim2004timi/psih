from sqlalchemy import DateTime, Table, ForeignKey, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True)
    # email: Mapped[str] = mapped_column(unique=True)
    tg_username: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[bytes]
    admin: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    access_storage: Mapped[bool] = mapped_column(default=False)
    access_crm: Mapped[bool] = mapped_column(default=False)
    access_message: Mapped[bool] = mapped_column(default=False)
    access_analytics: Mapped[bool] = mapped_column(default=False)

    files: Mapped[list["File"]] = relationship(back_populates="user")
    business_notes: Mapped[list["BusinessNote"]] = relationship(back_populates="user")
    gpt_messages: Mapped[list["GPTMessage"]] = relationship(back_populates="user")
