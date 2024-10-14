from fastapi import Depends, HTTPException
from starlette import status

from .auth.dependencies import get_current_auth_user
from .users.schemas import User as UserSchema


http_exception_403 = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Нет доступа к данному ресурсу",
)


async def check_permission_admin(user: UserSchema = Depends(get_current_auth_user)):
    if not user.admin:
        raise http_exception_403


async def check_permission_storage(user: UserSchema = Depends(get_current_auth_user)):
    if not user.access_storage:
        raise http_exception_403


async def check_permission_crm(user: UserSchema = Depends(get_current_auth_user)):
    if not user.access_crm:
        raise http_exception_403


async def check_permission_message(user: UserSchema = Depends(get_current_auth_user)):
    if not user.access_message:
        raise http_exception_403


async def check_permission_analytics(user: UserSchema = Depends(get_current_auth_user)):
    if not user.access_analytics:
        raise http_exception_403
