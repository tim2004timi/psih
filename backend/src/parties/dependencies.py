from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from ..database import db_manager
from .models import Party
from . import service


async def party_by_id_dependency(
    party_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
) -> Party:
    party = await service.get_party_by_id(session=session, party_id=party_id)
    return party
