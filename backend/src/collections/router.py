from typing import List

from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import db_manager
from . import service
from ..auth.dependencies import get_current_active_auth_user
from ..dependencies import check_permission, Permission
from .schemas import (
    Collection,
    CollectionCreate,
    CollectionNote,
    CollectionNoteCreate,
)


http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Collections"],
    prefix="/collections",
    dependencies=[
        Depends(http_bearer),
        Depends(get_current_active_auth_user),
        Depends(check_permission(Permission.ADMIN)),
    ],
)


@router.get(
    path="/",
    response_model=List[Collection],
    description="Get all collections",
)
async def get_all_collection(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_collections(session=session)


@router.post(
    path="/",
    response_model=Collection,
    description="Create new collection",
)
async def create_collection(
    collection_create: CollectionCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_collection(
        session=session, collection_create=collection_create
    )


@router.get(
    path="/{collection_id}/notes/",
    response_model=List[CollectionNote],
    description="Get all collection notes",
)
async def get_collection_notes_by_collection_id(
    collection_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_collection_notes_by_collection_id(
        session=session, collection_id=collection_id
    )


@router.post(
    path="/notes/",
    response_model=CollectionNote,
    description="Create new collection note",
)
async def create_collection_note(
    collection_note_create: CollectionNoteCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_collection_note(
        session=session, collection_note_create=collection_note_create
    )
