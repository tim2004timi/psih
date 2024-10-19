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
    ProductCategoryUpdatePartial,
)
from .models import Product, ProductCategory
from ..models import File as MyFile
from .utils import create_auto_article
from ..users.schemas import User
from ..utils import upload_file, delete_file


async def get_product_categories(session: AsyncSession) -> List[ProductCategory]:
    stmt = select(ProductCategory)
    result: Result = await session.execute(stmt)
    product_categories = result.scalars().all()
    return list(product_categories)


async def get_product_category_by_id(
    session: AsyncSession, product_category_id: int
) -> ProductCategory:
    product_category = await session.get(ProductCategory, product_category_id)
    if product_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Категория с ID ({product_category_id}) не найдена",
        )
    return product_category


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


async def update_product_category(
    session: AsyncSession,
    product_category: ProductCategory,
    product_category_update: ProductCategoryUpdatePartial,
) -> ProductCategory:
    for name, value in product_category_update.model_dump(exclude_unset=True).items():
        setattr(product_category, name, value)
    await session.commit()

    return product_category


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
            .options(selectinload(Product.files))
            .where(Product.archived == archived)
        )
    else:
        stmt = (
            select(Product)
            .options(selectinload(Product.category))
            .options(selectinload(Product.images))
            .options(selectinload(Product.files))
        )
    result: Result = await session.execute(stmt)
    products = result.scalars().all()
    return list(products)


async def get_product_by_id(session: AsyncSession, product_id: int) -> Product:
    stmt = (
        select(Product)
        .options(
            selectinload(Product.category),
            selectinload(Product.images).selectinload(MyFile.user),
            selectinload(Product.files).selectinload(MyFile.user),
        )
        .where(Product.id == product_id)
    )
    result: Result = await session.execute(stmt)
    product = result.scalars().one_or_none()
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

        product_with_category = await get_product_by_id(
            session=session, product_id=product.id
        )

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
        if name == "category_id":
            category = await get_product_category_by_id(
                session=session, product_category_id=value
            )
            product.category = category
            continue
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


async def upload_product_file(
    session: AsyncSession, product_id: int, user: User, is_image: bool, file: UploadFile
) -> MyFile:
    product = await get_product_by_id(session=session, product_id=product_id)
    url, human_size = await upload_file(file=file, dir_name="products")

    file = MyFile(
        url=url,
        owner_id=product.id,
        user_id=user.id,
        image=is_image,
        owner_type="Product",
        size=human_size,
    )
    session.add(file)
    await session.commit()
    await session.refresh(file)

    return file


async def delete_product_file_by_id(session: AsyncSession, file_id: int):
    image = await session.get(MyFile, file_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Файл с id({file_id}) не найдено",
        )
    try:
        response = await delete_file(file_path=image.url)
        await session.delete(image)
        await session.commit()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось удалить файл",
        )


async def delete_products(session: AsyncSession, product_ids: List[int]) -> None:
    stmt = delete(Product).where(Product.id.in_(product_ids))

    await session.execute(stmt)
    await session.commit()
