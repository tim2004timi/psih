from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from .database import Base


class File(Base):
    __tablename__ = "files"

    url: Mapped[str]
    image: Mapped[bool]  # image or file

    # Полиморфная связь (тип владельца и ID владельца)
    owner_id: Mapped[int] = mapped_column()
    owner_type: Mapped[str]

    # Связь с Order
    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="files",
        primaryjoin="and_(foreign(File.owner_id) == Order.id, File.owner_type == 'Order')",
        foreign_keys=[owner_id],
    )

    # Связь с Product
    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="files",
        primaryjoin="and_(foreign(File.owner_id) == Product.id, File.owner_type == 'Product')",
        foreign_keys=[owner_id],
    )


#
# class ProductImage(Base):
#     __tablename__ = "product_images"
#
#     url: Mapped[str]
#
#     product_id: Mapped[int] = mapped_column(
#         ForeignKey("products.id", ondelete="CASCADE")
#     )
#     product: Mapped["Product"] = relationship(back_populates="images")
