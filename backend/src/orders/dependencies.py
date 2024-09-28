from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from ..database import db_manager
from ..orders.models import Order
from . import service


async def order_by_id_dependency(
    order_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
) -> Order:
    order = await service.get_order_by_id(session=session, order_id=order_id)
    return order


# async def orders_by_id_multiple_dependency(
#     list_orders_id: List[int],
#     session: AsyncSession = Depends(db_manager.session_dependency),
# ) -> Order:
#     order = await service.get_order_by_id(session=session, order_id=order_id)
#
#     if order is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Заказ с ID ({order_id}) не найден",
#         )
#     return order
