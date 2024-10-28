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
    BusinessNote,
    BusinessNoteCreate,
)

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Business notes"],
    prefix="/business-notes",
    dependencies=[
        Depends(http_bearer),
        Depends(get_current_active_auth_user),
        Depends(check_permission(Permission.ADMIN)),
    ],
)


@router.get(
    path="/{user_id}",
    response_model=List[BusinessNote],
    description="Get all business notes by user ID",
)
async def get_business_notes_by_user_id(
    user_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_business_notes_by_user_id(session=session, user_id=user_id)


@router.post(
    path="/",
    response_model=BusinessNote,
    description="Create new business note",
)
async def create_business_note(
    business_note_create: BusinessNoteCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_business_note(
        session=session, business_note_create=business_note_create
    )
