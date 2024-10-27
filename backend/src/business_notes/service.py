from typing import List

from fastapi import HTTPException
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from src.business_notes.models import BusinessNote
from src.business_notes.schemas import BusinessNoteCreate


async def get_business_notes_by_user_id(
    session: AsyncSession, user_id: int
) -> List[BusinessNote]:
    stmt = select(BusinessNote).where(BusinessNote.user_id == user_id)
    result: Result = await session.execute(stmt)
    business_notes = result.scalars().all()
    return list(business_notes)


# async def get_business_notes_by_user_id(
#     session: AsyncSession, user_id: int
# ) -> List[BusinessNote]:
#     stmt = select(BusinessNote).where(BusinessNote.user_id == user_id)
#     result: Result = await session.execute(stmt)
#     business_notes = result.scalars().all()
#     return list(business_notes)


async def get_business_note_by_id(
    session: AsyncSession, business_note_id: int
) -> BusinessNote:
    stmt = select(BusinessNote).where(BusinessNote.id == business_note_id)
    result: Result = await session.execute(stmt)
    business_note = result.scalars().one_or_none()

    if business_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Запись с ID ({business_note_id}) не найдена",
        )
    return business_note


async def create_business_note(
    session: AsyncSession, business_note_create: BusinessNoteCreate
) -> BusinessNote:
    business_note = BusinessNote(**business_note_create.model_dump())
    session.add(business_note)
    await session.commit()
    await session.refresh(business_note)
    return business_note


async def delete_business_note(
    session: AsyncSession, business_note: BusinessNote
) -> BusinessNote:
    await session.delete(business_note)
    await session.commit()
    return business_note
