from typing import List

from fastapi import APIRouter, UploadFile, File
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import db_manager
from . import service, dependencies
from .schemas import ProductCategoryCreate, ProductCategoryWithProducts, ProductCreate, ProductUpdatePartial, \
    ProductCategory, Product


router = APIRouter(tags=["Products"], prefix="/products")


@router.get(
    path="/categories/",
    response_model=List[ProductCategory],
    description="Get all product categories",
)
async def get_all_product_categories(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_product_categories(session=session)


@router.get(
    path="/categories/full/",
    response_model=List[ProductCategoryWithProducts],
    description="Get all product categories with their products",
)
async def get_all_product_categories_with_products(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_product_categories_with_products(session=session)


@router.post(path="/categories/", response_model=ProductCategory | None, description="Create new product category")
async def create_product_category(
    product_category_create: ProductCategoryCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_product_category(session=session, product_category_create=product_category_create)


@router.delete(path="/categories/", response_model=ProductCategory, description="Delete product category by id")
async def delete_product_category_by_id(
    session: AsyncSession = Depends(db_manager.session_dependency),
    product_category: ProductCategory = Depends(dependencies.product_category_by_id_dependency),
):
    return await service.delete_product_category(session=session, product_category=product_category)


@router.get(
    path="/all/",
    response_model=List[Product],
    description="Get all products",
)
async def get_all_products(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_products(session=session)


@router.get(
    path="/archived/",
    response_model=List[Product],
    description="Get archived products",
)
async def get_archived_products(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_products(session=session, archived=True)


@router.get(
    path="/not-archived/",
    response_model=List[Product],
    description="Get not archived products",
)
async def get_not_archived_products(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_products(session=session, archived=False)


@router.post(path="/", response_model=Product | None, description="Create new product")
async def create_product(
    product_create: ProductCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_product(session=session, product_create=product_create)


@router.patch(path="/", response_model=None, description="Update partial product")
async def update_product(
    product_update: ProductUpdatePartial,
    session: AsyncSession = Depends(db_manager.session_dependency),
    product: Product = Depends(dependencies.product_by_id_dependency),
):
    return await service.update_product(
        session=session, product_update=product_update, product=product
    )


@router.delete(path="/", response_model=None, description="Delete product by id")
async def delete_product_by_id(
    session: AsyncSession = Depends(db_manager.session_dependency),
    product: Product = Depends(dependencies.product_by_id_dependency),
):
    return await service.delete_product(session=session, product=product)