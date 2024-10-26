from datetime import datetime
from typing import List

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Collection(Base):
    __tablename__ = "collections"

    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    products: Mapped[List["Product"]] = relationship(back_populates="collection")
    collection_notes: Mapped[List["CollectionNote"]] = relationship(
        back_populates="collection"
    )


class CollectionNote(Base):
    __tablename__ = "collection_notes"

    name: Mapped[str]
    amount: Mapped[int]
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    collection: Mapped["Collection"] = relationship(back_populates="collection_notes")
    collection_id: Mapped[int] = mapped_column(ForeignKey("collections.id"))
