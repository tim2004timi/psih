from typing import List

from sqlalchemy import DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


class Party(Base):
    __tablename__ = "parties"

    full_name: Mapped[str]
    party_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    status: Mapped[str] = mapped_column(
        nullable=False, default="на складе"
    )  # TODO: Сделать Enum
    tag: Mapped[str | None]
    address: Mapped[str | None]
    note: Mapped[str | None]
    storage: Mapped[str | None]
    project: Mapped[str | None]
    phone_number: Mapped[str]
    email: Mapped[str | None]

    # products_in_order: Mapped[list["ProductInOrder"]] = relationship(
    #     back_populates="order", cascade="all, delete-orphan", passive_deletes=True
    # )
    #
    # files: Mapped[List["File"]] = relationship(
    #     back_populates="order",
    #     cascade="all, delete-orphan",
    #     passive_deletes=True,
    #     primaryjoin="and_(foreign(File.owner_id) == Order.id, File.owner_type == 'Order', File.image == False)",
    # )