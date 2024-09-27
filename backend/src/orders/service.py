from typing import List

from sqlalchemy import select, desc, Result, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .schemas import OrderCreate, OrderUpdatePartial
from ..orders.models import Order
from ..products.models import ProductInOrder, Product


async def get_orders(session: AsyncSession) -> List[Order]:
    stmt = select(Order).order_by(desc(Order.id))
    result: Result = await session.execute(stmt)
    orders = result.scalars().all()
    return list(orders)


async def get_order_by_id(session: AsyncSession, order_id: int) -> Order | None:
    stmt = (
        select(Order)
        .options(
            selectinload(Order.products_in_order)
            .selectinload(ProductInOrder.product)
            .selectinload(Product.category),  # Загрузка категории
            selectinload(Order.products_in_order)
            .selectinload(ProductInOrder.product)
            .selectinload(Product.images),  # Загрузка изображений
        )
        .where(Order.id == order_id)
    )
    result: Result = await session.execute(stmt)
    order = result.scalars().one_or_none()
    return order


async def create_order(session: AsyncSession, order_create: OrderCreate) -> Order:
    order = Order(**order_create.model_dump(exclude="products_in_order"))
    session.add(order)
    await session.flush()

    for product_in_order_create in order_create.products_in_order:
        product_in_order = ProductInOrder(
            order_id=order.id, **product_in_order_create.model_dump()
        )
        session.add(product_in_order)
    await session.commit()
    await session.refresh(order)
    return await get_order_by_id(session=session, order_id=order.id)


async def update_order(
    session: AsyncSession, order: Order, order_update: OrderUpdatePartial
) -> Order:
    for name, value in order_update.model_dump(exclude_unset=True).items():
        if name == "products_in_order" and value:
            products_in_order = value

            await delete_products_in_order(session=session, order=order)

            for product_in_order in products_in_order:
                print(product_in_order)
                product_in_order = ProductInOrder(
                    order_id=order.id,
                    product_id=product_in_order["product_id"],
                    amount=product_in_order["amount"],
                )  # TODO: доделать (спросить логику редактирования у влада)
                session.add(product_in_order)
        else:
            setattr(order, name, value)
    await session.commit()
    await session.refresh(order)
    return await get_order_by_id(session=session, order_id=order.id)


async def delete_products_in_order(session: AsyncSession, order):
    stmt = delete(ProductInOrder).where(ProductInOrder.id == order.id)
    await session.execute(stmt)
    await session.commit()
    order.products_in_order = []


async def delete_order(session: AsyncSession, order: Order) -> Order:
    await session.delete(order)
    await session.commit()
    return order


async def delete_orders(session: AsyncSession, order_ids: List[int]) -> None:
    stmt = delete(Order).where(Order.id.in_(order_ids))

    await session.execute(stmt)
    await session.commit()
