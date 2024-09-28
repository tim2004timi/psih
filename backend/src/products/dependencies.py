from typing import List

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from ..database import db_manager
from .models import ProductCategory, Product
from . import service


async def product_category_by_id_dependency(
    product_category_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
) -> ProductCategory:
    product_category = await service.get_product_category_by_id(
        session=session, product_category_id=product_category_id
    )
    return product_category


async def product_by_id_dependency(
    product_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
) -> Product:
    return await service.get_product_by_id(session=session, product_id=product_id)
