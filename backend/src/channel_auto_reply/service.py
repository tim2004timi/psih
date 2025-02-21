from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, List

from .models import ChannelAutoReply

async def get_channel_auto_reply(session: AsyncSession) -> ChannelAutoReply | None:
    result = await session.execute(select(ChannelAutoReply).limit(1))
    return result.scalars().first()

async def create_or_update_channel_auto_reply(
    session: AsyncSession,
    photo_file_id: Optional[str],
    text: Optional[str],
    buttons: Optional[list],
) -> ChannelAutoReply:
    existing = await get_channel_auto_reply(session)
    if not existing:
        # Создаем новую запись
        new_config = ChannelAutoReply(
            photo_file_id=photo_file_id,
            text=text,
            buttons=buttons,
        )
        session.add(new_config)
        await session.commit()
        await session.refresh(new_config)
        return new_config
    else:
        # Обновляем существующую
        stmt = (
            update(ChannelAutoReply)
            .where(ChannelAutoReply.id == existing.id)
            .values(
                photo_file_id=photo_file_id if photo_file_id is not None else existing.photo_file_id,
                text=text if text is not None else existing.text,
                buttons=buttons if buttons is not None else existing.buttons,
            )
            .returning(ChannelAutoReply)
        )
        result = await session.execute(stmt)
        await session.commit()
        return result.scalar_one()