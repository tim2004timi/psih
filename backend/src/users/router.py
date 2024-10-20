from typing import List

from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from .dependencies import user_by_id_dependency
from ..database import db_manager
from . import service
from ..auth.dependencies import get_current_active_auth_user
from ..dependencies import check_permission, Permission
from .schemas import User, UserCreate, UserUpdatePartial, UserMeUpdatePartial

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Users"],
    prefix="/users",
    dependencies=[
        Depends(http_bearer),
        Depends(get_current_active_auth_user),
    ],
)


@router.get(
    path="/",
    response_model=List[User],
    description="Get all users for admin",
    dependencies=[Depends(check_permission(Permission.ADMIN))],
)
async def get_users(
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.get_users(session=session)


@router.post(
    path="/",
    response_model=User,
    description="Create new user for admin",
    dependencies=[Depends(check_permission(Permission.ADMIN))],
)
async def create_user(
    user_create: UserCreate,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_user(session=session, user=user_create)


@router.patch(
    path="/",
    response_model=User,
    description="Update partial user for admin",
    dependencies=[Depends(check_permission(Permission.ADMIN))],
)
async def update_user(
    user_update: UserUpdatePartial,
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(user_by_id_dependency),
):
    return await service.update_user(
        session=session,
        user_update=user_update,
        user=user,
    )


@router.delete(
    path="/",
    response_model=User,
    description="Delete user for admin",
    dependencies=[Depends(check_permission(Permission.ADMIN))],
)
async def delete_user(
    session: AsyncSession = Depends(db_manager.session_dependency),
    user: User = Depends(user_by_id_dependency),
):
    return await service.delete_user(
        session=session,
        user=user,
    )


@router.get(
    path="/me/",
    response_model=User,
    description="Get current auth user",
)
async def get_current_auth_user(user: User = Depends(get_current_active_auth_user)):
    return user


@router.patch(
    path="/me/",
    response_model=User,
    description="Update current auth user",
)
async def update_current_auth_user(
    user_update: UserMeUpdatePartial,
    user: User = Depends(get_current_active_auth_user),
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.update_user(
        session=session,
        user_update=user_update,
        user=user,
    )
