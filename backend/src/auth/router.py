from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from .jwtcreators import (
    create_access_token,
    create_refresh_token,
)
from .dependencies import (
    get_current_token_payload,
    get_current_auth_user_for_refresh,
    get_current_active_auth_user,
    validate_auth_user,
)
from .service import login, verify_code
from ..database import db_manager
from ..users import service
from ..users.schemas import User as UserSchema, UserCreate as UserCreateSchema
from .schemas import TokenInfo

http_bearer = HTTPBearer(auto_error=False)


router = APIRouter(
    prefix="/jwt",
    tags=["JWT"],
)


@router.post("/login/", response_model=TokenInfo, deprecated=True)
async def auth_user_issue_jwt(
    user: UserSchema = Depends(validate_auth_user),
):
    access_token = await create_access_token(user)
    refresh_token = await create_refresh_token(user)
    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/validate/")
async def auth_user_issue_jwt(
    _: UserSchema = Depends(validate_auth_user),
):
    return {"message": "OK"}


@router.post("/2fa-1-step/")
async def login_1_step(response: dict[str, str] = Depends(login)):
    return response


@router.post("/2fa-2-step/", response_model=TokenInfo)
async def login_2_step(user: UserSchema = Depends(verify_code)):
    access_token = await create_access_token(user)
    refresh_token = await create_refresh_token(user)
    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/refresh/",
    response_model=TokenInfo,
    response_model_exclude_none=True,
    dependencies=[Depends(http_bearer)],
)
async def auth_refresh_jwt(
    user: UserSchema = Depends(get_current_auth_user_for_refresh),
):
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неактивный пользователь",
        )
    access_token = await create_access_token(user)
    return TokenInfo(
        access_token=access_token,
    )
