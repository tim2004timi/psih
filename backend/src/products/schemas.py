from typing import Optional, List

from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime


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
    products: List['Product']


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    min_price: float
    cost_price: float
    price: float
    discount_price: float
    category_id: int
    article: str
    measure: str | None = "шт."
    size: str
    remaining: int | None = 0
    archived: bool | None = False


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
    measure: str | None = None
    size: str | None = None
    remaining: int | None = None
    archived: bool | None = None


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: ProductCategory

