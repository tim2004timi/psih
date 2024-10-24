from typing import List

from sqlalchemy import select, desc, Result, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette import status
from fastapi import HTTPException, UploadFile

from .schemas import PartyCreate
from ..parties.models import Party
from ..products.models import (
    Modification,
    ModificationInParty,
)
from ..users.schemas import User
from ..utils import upload_file, delete_file
from ..models import File as MyFile


async def get_parties(session: AsyncSession) -> List[Party]:
    stmt = select(Party).order_by(desc(Party.id))
    result: Result = await session.execute(stmt)
    parties = result.scalars().all()
    return list(parties)


async def get_party_by_id(session: AsyncSession, party_id: int) -> Party:
    stmt = (
        select(Party)
        .options(
            selectinload(Party.files).selectinload(MyFile.user),
            selectinload(Party.modifications_in_party)
            .selectinload(ModificationInParty.modification)
            .selectinload(Modification.product),
        )
        .where(Party.id == party_id)
    )
    result: Result = await session.execute(stmt)
    party = result.scalars().one_or_none()

    if party is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Партия с ID ({party_id}) не найден",
        )
    return party


async def create_party(session: AsyncSession, party_create: PartyCreate) -> Party:
    party = Party(**party_create.model_dump(exclude={"modifications_in_party"}))
    session.add(party)
    await session.flush()

    for modification_in_party_create in party_create.modifications_in_party:
        modification_in_party = ModificationInParty(
            party_id=party.id, **modification_in_party_create.model_dump()
        )
        session.add(modification_in_party)
    await session.commit()
    return await get_party_by_id(session=session, party_id=party.id)


async def delete_party(session: AsyncSession, party: Party) -> Party:
    await session.delete(party)
    await session.commit()
    return party


async def delete_parties(session: AsyncSession, party_ids: List[int]) -> None:
    stmt = delete(Party).where(Party.id.in_(party_ids))

    await session.execute(stmt)
    await session.commit()


async def delete_party_file_by_id(session: AsyncSession, file_id: int):
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


async def upload_party_file(
    session: AsyncSession, party_id: int, user: User, is_image: bool, file: UploadFile
) -> MyFile:
    party = await get_party_by_id(session=session, party_id=party_id)
    url, human_size = await upload_file(file=file, dir_name="parties")

    file = MyFile(
        url=url,
        owner_id=party.id,
        user_id=user.id,
        image=is_image,
        owner_type="Party",
        size=human_size,
    )
    session.add(file)
    await session.commit()
    await session.refresh(file)

    return file
