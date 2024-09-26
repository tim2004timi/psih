from typing import List

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import db_manager
from . import service, dependencies
from src.orders.schemas import (
    Order,
    OrderCreate,
    OrderUpdatePartial,
    OrderWithoutProducts,
)

router = APIRouter(tags=["Orders"], prefix="/orders")


@router.get(
    path="/",
    response_model=List[OrderWithoutProducts],
    description="Get all orders with all information",
)
async def get_all_orders(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_orders(session=session)


@router.get(path="/{order_id}/", response_model=Order, description="Get order by id")
async def get_order_by_id(
    order_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
):
    return await service.get_order_by_id(session=session, order_id=order_id)


@router.post(path="/", response_model=Order, description="Create new order")
async def create_order(
    order_create: OrderCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_order(session=session, order_create=order_create)


@router.patch(path="/", response_model=Order, description="Update partial new order")
async def update_order(
    order_update: OrderUpdatePartial,
    session: AsyncSession = Depends(db_manager.session_dependency),
    order: Order = Depends(dependencies.order_by_id_dependency),
):
    return await service.update_order(
        session=session, order_update=order_update, order=order
    )


@router.delete(
    path="/", response_model=OrderWithoutProducts, description="Delete order by id"
)
async def delete_order_by_id(
    session: AsyncSession = Depends(db_manager.session_dependency),
    order: Order = Depends(dependencies.order_by_id_dependency),
):
    return await service.delete_order(session=session, order=order)


@router.delete(
    path="/multiple/", response_model=None, description="Delete orders by ids"
)
async def delete_orders_by_id_multiple(
    order_ids: List[int], session: AsyncSession = Depends(db_manager.session_dependency)
):
    return await service.delete_orders(session=session, order_ids=order_ids)
