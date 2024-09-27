from typing import List

from fastapi import HTTPException, UploadFile, File
from starlette import status

from sqlalchemy import select, desc, Result, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from asyncpg.exceptions import UniqueViolationError

from .schemas import (
    ProductCategoryCreate,
    ProductCategoryWithProducts,
    ProductCreate,
    ProductUpdatePartial,
)
from .models import Product, ProductCategory, ProductImage
from .utils import create_auto_article
from ..utils import upload_file


async def get_product_categories(session: AsyncSession) -> List[ProductCategory]:
    stmt = select(ProductCategory)
    result: Result = await session.execute(stmt)
    product_categories = result.scalars().all()
    return list(product_categories)


async def get_product_category_by_id(
    session: AsyncSession, product_category_id: int
) -> ProductCategory:
    return await session.get(ProductCategory, product_category_id)


async def create_product_category(
    session: AsyncSession, product_category_create: ProductCategoryCreate
) -> ProductCategory:
    try:
        product_category = ProductCategory(**product_category_create.model_dump())
        session.add(product_category)
        await session.commit()
        await session.refresh(product_category)
        return product_category

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Категория с именем '{product_category_create.name}' уже существует",
        )


async def delete_product_category(
    session: AsyncSession, product_category: ProductCategory
) -> ProductCategory:
    await session.delete(product_category)
    await session.commit()
    return product_category


async def get_product_categories_with_products(
    session: AsyncSession,
) -> List[ProductCategoryWithProducts]:
    result: Result = await session.execute(
        select(ProductCategory).options(selectinload(ProductCategory.products))
    )
    product_categories = result.scalars().all()
    return list(product_categories)


async def get_products(
    session: AsyncSession, archived: bool | None = None
) -> List[Product]:
    if archived is not None:
        stmt = (
            select(Product)
            .options(selectinload(Product.category))
            .options(selectinload(Product.images))
            .where(Product.archived == archived)
        )
    else:
        stmt = (
            select(Product)
            .options(selectinload(Product.category))
            .options(selectinload(Product.images))
        )
    result: Result = await session.execute(stmt)
    products = result.scalars().all()
    return list(products)


async def get_product_by_id(session: AsyncSession, product_id: int) -> Product:
    product = await session.get(Product, product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Продукт с ID ({product_id}) не найден",
        )
    return product


async def create_product(
    session: AsyncSession, product_create: ProductCreate
) -> Product:
    try:
        product = Product(**product_create.model_dump())

        if not product.article:
            product.article = "temporary"

        session.add(product)
        await session.flush()

        if product.article == "temporary":
            product.article = create_auto_article(product)

        await session.commit()
        await session.refresh(product)

        result: Result = await session.execute(
            select(Product)
            .options(selectinload(Product.category))
            .where(Product.id == product.id)
        )
        product_with_category = result.scalars().first()

        return product_with_category

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Категория с id '{product_create.category_id}' не существует",
        )


async def update_product(
    session: AsyncSession, product: Product, product_update: ProductUpdatePartial
) -> Product:
    for name, value in product_update.model_dump(exclude_unset=True).items():
        setattr(product, name, value)
    await session.commit()

    result: Result = await session.execute(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product.id)
    )
    product_with_category = result.scalars().first()
    return product_with_category


async def delete_product(session: AsyncSession, product: Product) -> None:
    await session.delete(product)
    await session.commit()
    return None


async def upload_product_image(
    session: AsyncSession, product_id: int, file: UploadFile
) -> ProductImage:
    product = await get_product_by_id(session=session, product_id=product_id)
    url = await upload_file(file=file, dir_name="products")

    image = ProductImage(url=url, product_id=product.id)
    session.add(image)
    await session.commit()
    await session.refresh(image)

    return image
