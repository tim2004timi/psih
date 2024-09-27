from typing import Optional, List

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from datetime import datetime
from enum import Enum

from ..orders.schemas import Order


class ProductCategoryBase(BaseModel):
    name: str


class ProductCategoryCreate(ProductCategoryBase):
    pass


class ProductCategory(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ProductCategoryWithProducts(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    products: List["Product"]


class SizeEnum(str, Enum):
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"


class ProductBase(BaseModel):
    name: str = Field(example="Шмотка")
    description: str | None = Field(default=None, example="Описание шмотки")
    min_price: float = Field(example=100.0)
    cost_price: float = Field(example=100.0)
    price: float = Field(example=100.0)
    discount_price: float = Field(example=100.0)
    category_id: int
    article: str | None = Field(default=None, example="ARTICLE")
    measure: str | None = "шт."
    size: SizeEnum = SizeEnum.S.value
    remaining: int = 0
    archived: bool = False

    @field_validator("min_price", "cost_price", "price", "discount_price")
    @classmethod
    def check_positive_prices(cls, value):
        if value <= 0:
            raise ValueError("Цена должна быть больше нуля")
        return value


class ProductCreate(ProductBase):
    pass


class ProductDelete(BaseModel):
    id: int


class ProductUpdatePartial(ProductBase):
    name: str | None = None
    description: str | None = None
    min_price: float | None = None
    cost_price: float | None = None
    price: float | None = None
    discount_price: float | None = None
    category_id: int | None = None
    article: str | None = None
    measure: str | None = Field(
        default=None, description="Описание товара", example="шт."
    )
    size: str | None = None
    remaining: int | None = None
    archived: bool | None = None

    @field_validator("min_price", "cost_price", "price", "discount_price")
    @classmethod
    def check_positive_prices(cls, value):
        if (value is not None) and (value <= 0):
            raise ValueError("Цена должна быть больше нуля")
        return value


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: ProductCategory
    images: List["ProductImage"]


class ProductInOrderBase(BaseModel):
    amount: int


class ProductInOrderCreate(ProductInOrderBase):
    product_id: int
    order_id: int


class ProductInOrderCreateWithoutOrder(ProductInOrderBase):
    product_id: int


class ProductInOrder(ProductInOrderBase):
    model_config = ConfigDict(from_attributes=True)

    product: "Product"
    # order: "Order"
    id: int


class ProductImage(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str


from ..orders.schemas import Order
