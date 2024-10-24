from typing import List

from fastapi import APIRouter, UploadFile, File
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import db_manager
from .schemas import PartyWithoutProducts, Party, PartyCreate
from ..auth.dependencies import get_current_active_auth_user
from ..dependencies import check_permission, Permission
from . import service
from . import dependencies
from ..schemas import File as MyFile
from ..users.schemas import User

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Parties"],
    prefix="/parties",
    dependencies=[
        Depends(http_bearer),
        Depends(get_current_active_auth_user),
        Depends(check_permission(Permission.STORAGE)),
    ],
)


@router.get(
    path="/", response_model=List[PartyWithoutProducts], description="Get all parties"
)
async def get_parties(session: AsyncSession = Depends(db_manager.session_dependency)):
    return await service.get_parties(session=session)


@router.get(
    path="/{party_id}/",
    response_model=Party,
    description="Get party with all information",
)
async def get_party_by_id(
    party_id: int, session: AsyncSession = Depends(db_manager.session_dependency)
):
    return await service.get_party_by_id(session=session, party_id=party_id)


@router.post(path="/", response_model=Party, description="Create new party")
async def create_party(
    party_crate: PartyCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_party(session=session, party_create=party_crate)


@router.post(
    "/{party_id}/upload-file/",
    response_model=MyFile,
    description="Upload party file",
)
async def upload_party_file(
    party_id: int,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(get_current_active_auth_user),
):
    return await service.upload_party_file(
        party_id=party_id, user=user, file=file, session=session, is_image=False
    )


@router.delete(path="/files/", description="Delete party file by id")
async def delete_party_file_by_id(
    file_id: int,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.delete_party_file_by_id(session=session, file_id=file_id)


@router.delete(
    path="/", response_model=PartyWithoutProducts, description="Delete party by id"
)
async def delete_party_by_id(
    session: AsyncSession = Depends(db_manager.session_dependency),
    party: Party = Depends(dependencies.party_by_id_dependency),
):
    return await service.delete_party(session=session, party=party)


@router.delete(
    path="/multiple/", response_model=None, description="Delete orders by ids"
)
async def delete_parties_by_id_multiple(
    party_ids: List[int], session: AsyncSession = Depends(db_manager.session_dependency)
):
    return await service.delete_parties(session=session, party_ids=party_ids)
