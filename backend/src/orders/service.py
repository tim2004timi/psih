from typing import List

from sqlalchemy import select, desc, Result
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import OrderCreate, OrderUpdatePartial
from ..orders.models import Order


async def get_orders(session: AsyncSession) -> List[Order]:
    stmt = select(Order).order_by(desc(Order.id))
    result: Result = await session.execute(stmt)
    orders = result.scalars().all()
    return list(orders)


async def get_order_by_id(session: AsyncSession, order_id: int) -> Order | None:
    return await session.get(Order, order_id)


async def create_order(session: AsyncSession, order_create: OrderCreate) -> Order:
    order = Order(**order_create.model_dump())
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order


async def update_order(session: AsyncSession, order: Order, order_update: OrderUpdatePartial) -> Order:
    for name, value in order_update.model_dump(exclude_unset=True).items():
        setattr(order, name, value)
    await session.commit()
    return order

async def delete_order(session: AsyncSession, order: Order) -> None:
    await session.delete(order)
    await session.commit()