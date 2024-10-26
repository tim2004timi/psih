from typing import List

from fastapi import HTTPException, UploadFile, File
from starlette import status

from sqlalchemy import select, desc, Result, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from asyncpg.exceptions import UniqueViolationError

from .schemas import CollectionCreate, CollectionNoteCreate

from .models import Collection, CollectionNote


async def get_collections(session: AsyncSession) -> List[Collection]:
    stmt = select(Collection)
    result: Result = await session.execute(stmt)
    collections = result.scalars().all()
    return list(collections)


async def get_collection_by_id(session: AsyncSession, collection_id: int) -> Collection:
    stmt = (
        select(Collection)
        .options(selectinload(Collection.collection_notes))
        .where(Collection.id == collection_id)
    )
    result: Result = await session.execute(stmt)
    collection = result.scalars().one_or_none()

    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Коллекция с ID ({collection_id}) не найдена",
        )
    return collection


async def create_collection(
    session: AsyncSession, collection_create: CollectionCreate
) -> Collection:
    result = await session.execute(
        select(Collection).where(Collection.name == collection_create.name)
    )
    count = len(result.scalars().all())
    if count != 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Коллекция с именем '{collection_create.name}' уже существует",
        )

    collection = Collection(**collection_create.model_dump())
    session.add(collection)
    await session.commit()
    await session.refresh(collection)
    return collection


async def delete_collection(
    session: AsyncSession, collection: Collection
) -> Collection:
    await session.delete(collection)
    await session.commit()
    return collection


async def get_collection_notes_by_collection_id(
    session: AsyncSession, collection_id: int
) -> List[CollectionNote]:
    stmt = select(CollectionNote).where(CollectionNote.collection_id == collection_id)
    result: Result = await session.execute(stmt)
    collection_notes = result.scalars().all()
    return list(collection_notes)


async def get_collection_note_by_id(
    session: AsyncSession, collection_note_id: int
) -> CollectionNote:
    stmt = select(CollectionNote).where(CollectionNote.id == collection_note_id)
    result: Result = await session.execute(stmt)
    collection_note = result.scalars().one_or_none()

    if collection_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Запись с ID ({collection_note_id}) не найдена",
        )
    return collection_note


async def create_collection_note(
    session: AsyncSession, collection_note_create: CollectionNoteCreate
) -> CollectionNote:
    collection_note = CollectionNote(**collection_note_create.model_dump())
    session.add(collection_note)
    await session.commit()
    await session.refresh(collection_note)
    return collection_note


async def delete_collection_note(
    session: AsyncSession, collection_note: CollectionNote
) -> CollectionNote:
    await session.delete(collection_note)
    await session.commit()
    return collection_note
