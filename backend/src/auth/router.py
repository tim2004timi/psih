from fastapi import (
    APIRouter,
    Depends,
)
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

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
from ..database import db_manager
from ..users import service
from ..users.schemas import User as UserSchema, UserCreate as UserCreateSchema
from .schemas import TokenInfo

http_bearer = HTTPBearer(auto_error=False)


router = APIRouter(
    prefix="/jwt",
    tags=["JWT"],
    dependencies=[Depends(http_bearer)],
)


@router.post("/login/", response_model=TokenInfo)
async def auth_user_issue_jwt(
    user: UserSchema = Depends(validate_auth_user),
):
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
)
async def auth_refresh_jwt(
    # todo: validate user is active!!
    user: UserSchema = Depends(get_current_auth_user_for_refresh),
):
    access_token = await create_access_token(user)
    return TokenInfo(
        access_token=access_token,
    )


@router.get("/users/me/")
async def auth_user_check_self_info(
    payload: dict = Depends(get_current_token_payload),
    user: UserSchema = Depends(get_current_active_auth_user),
):
    iat = payload.get("iat")
    return {
        "username": user.username,
        "email": user.email,
        "logged_in_at": iat,
    }


@router.post("/sign-in/", response_model=UserSchema)
async def create_user(
    user: UserCreateSchema,
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    return await service.create_user(session=session, user=user)
