from enum import Enum

from fastapi import Depends, HTTPException
from starlette import status

from .auth.dependencies import get_current_auth_user
from .users.schemas import User as UserSchema


class Permission(Enum):
    ADMIN = 1
    STORAGE = 2
    CRM = 3
    MESSAGE = 4
    ANALYTICS = 5


HTTP_EXCEPTION_403 = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Нет доступа к данному ресурсу",
)


def check_permission(permission: Permission):
    async def check(user: UserSchema = Depends(get_current_auth_user)):
        if permission == Permission.ADMIN and not user.admin:
            raise HTTP_EXCEPTION_403
        if permission == Permission.STORAGE and not user.access_storage:
            raise HTTP_EXCEPTION_403
        if permission == Permission.CRM and not user.access_crm:
            raise HTTP_EXCEPTION_403
        if permission == Permission.MESSAGE and not user.access_message:
            raise HTTP_EXCEPTION_403
        if permission == Permission.ANALYTICS and not user.access_analytics:
            raise HTTP_EXCEPTION_403
    return check
