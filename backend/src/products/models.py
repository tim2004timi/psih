from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class ProductCategory(Base):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    products: Mapped[List["Product"]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    name: Mapped[str]
    description: Mapped[str | None] = mapped_column(nullable=True, default=None)
    min_price: Mapped[float]
    cost_price: Mapped[float]
    price: Mapped[float]
    discount_price: Mapped[float]
    measure: Mapped[str] = mapped_column(nullable=False, default="шт.")
    archived: Mapped[bool] = mapped_column(nullable=False, default=False)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["ProductCategory"] = relationship(back_populates="products")

    modifications: Mapped[List["Modification"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )

    images: Mapped[List["File"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product', File.image == True)",
        overlaps="files, order",
    )

    files: Mapped[List["File"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product', File.image == False)",
        overlaps="images, order, files",
    )


class Modification(Base):
    __tablename__ = "modifications"

    article: Mapped[str] = mapped_column(nullable=False)  # TODO: Сделать уникальным
    size: Mapped[str]
    remaining: Mapped[int] = mapped_column(nullable=False, default=0)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    product: Mapped["Product"] = relationship(back_populates="modifications")

    modifications_in_order: Mapped[List["ModificationInOrder"]] = relationship(
        back_populates="modification",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    modifications_in_party: Mapped[List["ModificationInParty"]] = relationship(
        back_populates="modification",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class ModificationInOrder(Base):
    __tablename__ = "modifications_in_order"

    amount: Mapped[int]

    modification_id: Mapped[int] = mapped_column(
        ForeignKey("modifications.id", ondelete="CASCADE")
    )
    modification: Mapped["Modification"] = relationship(
        back_populates="modifications_in_order"
    )

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    order: Mapped["Order"] = relationship(back_populates="modifications_in_order")


class ModificationInParty(Base):
    __tablename__ = "modifications_in_party"

    amount: Mapped[int]

    modification_id: Mapped[int] = mapped_column(
        ForeignKey("modifications.id", ondelete="CASCADE")
    )
    modification: Mapped["Modification"] = relationship(
        back_populates="modifications_in_party"
    )

    party_id: Mapped[int] = mapped_column(ForeignKey("parties.id", ondelete="CASCADE"))
    party: Mapped["Party"] = relationship(back_populates="modifications_in_party")


from ..parties.models import Party
