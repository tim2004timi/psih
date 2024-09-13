from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class ProductCategory(Base):
    __tablename__ = 'categories'

    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    products = relationship('Product', back_populates='category')


class Product(Base):
    __tablename__ = 'products'

    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=True, default=None)
    min_price: Mapped[float] = mapped_column(nullable=False)
    cost_price: Mapped[float] = mapped_column(nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    discount_price: Mapped[float] = mapped_column(nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'))
    article: Mapped[str] = mapped_column(nullable=False)  # TODO: Сделать уникальным
    measure: Mapped[str] = mapped_column(nullable=False)
    size: Mapped[str] = mapped_column(nullable=False)
    archived: Mapped[bool] = mapped_column(nullable=True, default=False)

    # Связь с категорией
    category = relationship('ProductCategory', back_populates='products')

    # photos
