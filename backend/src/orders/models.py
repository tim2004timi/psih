from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


class Order(Base):
    __tablename__ = "orders"

    full_name: Mapped[str] = mapped_column(nullable=False)
    order_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    status: Mapped[str] = mapped_column(
        nullable=False, default="в обработке"
    )  # TODO Указать дефолт
    messages: Mapped[str] = mapped_column(nullable=True, default=None)
    tag: Mapped[str] = mapped_column(nullable=True, default=None)
    channel: Mapped[str] = mapped_column(nullable=True, default=None)
    address: Mapped[str] = mapped_column(nullable=False)
    task: Mapped[str] = mapped_column(nullable=True, default=None)
    note: Mapped[str] = mapped_column(nullable=True, default=None)
    comment: Mapped[str] = mapped_column(nullable=True, default=None)
    storage: Mapped[str] = mapped_column(nullable=True, default=None)
    project: Mapped[str] = mapped_column(nullable=True, default=None)
    phone_number: Mapped[str] = mapped_column(nullable=True, default=None)
    email: Mapped[str] = mapped_column(nullable=True, default=None)
    summ: Mapped[int] = mapped_column(nullable=True, default=0)

    # products
    # files
