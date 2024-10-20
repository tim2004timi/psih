from typing import List

from sqlalchemy import DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


class Order(Base):
    __tablename__ = "orders"

    full_name: Mapped[str]
    order_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    status: Mapped[str] = mapped_column(
        nullable=False, default="в обработке"
    )  # TODO: Сделать Enum
    messages: Mapped[str | None]
    tag: Mapped[str | None]
    channel: Mapped[str | None]
    address: Mapped[str | None]
    task: Mapped[str | None]
    note: Mapped[str | None]
    comment: Mapped[str | None]
    storage: Mapped[str | None]
    project: Mapped[str | None]
    phone_number: Mapped[str]
    email: Mapped[str | None]
    # summ: Mapped[int | None] = mapped_column(nullable=True, default=0)

    modifications_in_order: Mapped[list["ModificationInOrder"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", passive_deletes=True
    )

    files: Mapped[List["File"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Order.id, File.owner_type == 'Order', File.image == False)",
        overlaps="product, images",
    )

    # другая инфа для суммы
