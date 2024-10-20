from typing import List

from sqlalchemy import DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


class Party(Base):
    __tablename__ = "parties"

    agent_name: Mapped[str | None]
    party_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    status: Mapped[str] = mapped_column(
        nullable=False, default="на складе"
    )  # TODO: Сделать Enum
    tag: Mapped[str | None]
    note: Mapped[str | None]
    storage: Mapped[str | None]
    project: Mapped[str | None]
    phone_number: Mapped[str]

    modifications_in_party: Mapped[list["ModificationInParty"]] = relationship(
        back_populates="party", cascade="all, delete-orphan", passive_deletes=True
    )

    files: Mapped[List["File"]] = relationship(
        back_populates="party",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Party.id, File.owner_type == 'Party', File.image == False)",
    )
