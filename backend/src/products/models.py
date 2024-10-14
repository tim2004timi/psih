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
    article: Mapped[str] = mapped_column(nullable=False)  # TODO: Сделать уникальным
    measure: Mapped[str] = mapped_column(nullable=False, default="шт.")
    size: Mapped[str]
    remaining: Mapped[int] = mapped_column(nullable=False, default=0)
    archived: Mapped[bool] = mapped_column(nullable=False, default=False)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["ProductCategory"] = relationship(back_populates="products")

    products_in_order: Mapped[List["ProductInOrder"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", passive_deletes=True
    )

    images: Mapped[List["File"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product', File.image == True)",
    )

    files: Mapped[List["File"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        passive_deletes=True,
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product', File.image == False)",
    )


class ProductInOrder(Base):
    __tablename__ = "products_in_order"

    amount: Mapped[int]

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    product: Mapped["Product"] = relationship(back_populates="products_in_order")

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    order: Mapped["Order"] = relationship(back_populates="products_in_order")
