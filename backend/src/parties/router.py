from typing import List

from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import db_manager
from ..auth.dependencies import get_current_active_auth_user
from ..dependencies import check_permission, Permission
from ..products import service
from ..products.schemas import Product

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    tags=["Remaining"],
    prefix="/remaining",
    dependencies=[
        Depends(http_bearer),
        Depends(get_current_active_auth_user),
        Depends(check_permission(Permission.STORAGE)),
    ],
)
