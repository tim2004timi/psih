from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column

from .database import Base
from .users import User


class File(Base):
    __tablename__ = "files"

    url: Mapped[str]
    size: Mapped[str] = mapped_column(nullable=True, default="?")
    image: Mapped[bool]  # image or file
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    # Полиморфная связь (тип владельца и ID владельца)
    owner_id: Mapped[int] = mapped_column()
    owner_type: Mapped[str]

    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    user: Mapped[User | None] = relationship(back_populates="files")

    # Связь с Order
    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="files",
        primaryjoin="and_(foreign(File.owner_id) == Order.id, File.owner_type == 'Order')",
        foreign_keys=[owner_id],
        overlaps="files, product, party",
    )

    # Связь с Product
    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="files",
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product')",
        foreign_keys=[owner_id],
        overlaps="files, order, party",
    )

    # Связь с Party
    party: Mapped["Party"] = relationship(
        "Product",
        back_populates="files",
        primaryjoin="and_(foreign(File.owner_id) == Party.id, File.owner_type == 'Party')",
        foreign_keys=[owner_id],
        overlaps="files, order, product",
    )
