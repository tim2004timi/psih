from typing import List

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from enum import Enum

from ..schemas import File as MyFile, FileWithoutUser as MyFileWithoutUser


class SizeEnum(str, Enum):
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"


class ProductCategoryBase(BaseModel):
    name: str


class ProductCategoryCreate(ProductCategoryBase):
    pass


class ProductCategoryUpdatePartial(ProductCategoryBase):
    pass


class ProductCategory(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ProductCategoryWithProducts(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    products: List["Product"]


class ProductBase(BaseModel):
    name: str = Field(example="Шмотка")
    description: str | None = Field(default=None, example="Описание шмотки")
    min_price: float = Field(example=100.0)
    cost_price: float = Field(example=100.0)
    price: float = Field(example=100.0)
    discount_price: float = Field(example=100.0)
    category_id: int
    measure: str | None = "шт."
    archived: bool = False

    @field_validator("min_price", "cost_price", "price", "discount_price")
    @classmethod
    def check_positive_prices(cls, value):
        if value <= 0:
            raise ValueError("Цена должна быть больше нуля")
        return value


class ProductCreate(ProductBase):
    sizes: List[SizeEnum]


class ProductDelete(BaseModel):
    id: int


class ProductUpdatePartial(ProductBase):
    name: str | None = None
    description: str | None = None
    min_price: float | None = Field(default=None, example=100.0)
    cost_price: float | None = Field(default=None, example=100.0)
    price: float | None = Field(default=None, example=100.0)
    discount_price: float | None = Field(default=None, example=100.0)
    category_id: int | None = None
    measure: str | None = Field(
        default=None, description="Описание товара", example="шт."
    )
    archived: bool | None = False


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: ProductCategory
    images: List["MyFile"]
    files: List["MyFile"]
    modifications: List["Modification"]


class ProductWithoutUser(Product):
    images: List["MyFileWithoutUser"]
    files: List["MyFileWithoutUser"]


class ProductWithoutModifications(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: ProductCategory
    images: List["MyFile"]
    files: List["MyFile"]


class ModificationBase(BaseModel):
    size: SizeEnum = SizeEnum.S.value
    article: str | None = Field(default=None, example="ARTICLE")
    remaining: int = 0


class ModificationCreate(ModificationBase):
    product_id: int


class ModificationUpdate(ModificationBase):
    size: SizeEnum | None = SizeEnum.S.value
    article: str | None = None
    remaining: int | None = None


class Modification(ModificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product: "ProductWithoutModifications"


class ModificationInOrderBase(BaseModel):
    amount: int


class ModificationInOrderCreate(ModificationInOrderBase):
    modification_id: int
    order_id: int


class ModificationInOrderCreateWithoutOrder(ModificationInOrderBase):
    modification_id: int


class ModificationInOrder(ModificationInOrderBase):
    model_config = ConfigDict(from_attributes=True)

    modification: "Modification"
    id: int


class ModificationInPartyBase(BaseModel):
    amount: int


class ModificationInPartyCreate(ModificationInOrderBase):
    modification_id: int
    party_id: int


class ModificationInPartyCreateWithoutParty(ModificationInOrderBase):
    modification_id: int


class ModificationInParty(ModificationInOrderBase):
    model_config = ConfigDict(from_attributes=True)

    modification: "Modification"
    id: int


from ..orders.schemas import Order
