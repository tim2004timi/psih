from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from . import models, schemas
from .models import Admin
from .. import security


async def get_admin_by_username(session: AsyncSession, username: str) -> Admin:
    stmt = select(Admin).where(Admin.username == username)
    result: Result = await session.execute(stmt)
    admin = result.scalar_one_or_none()
    return admin


async def create_admin(session: AsyncSession, admin: schemas.AdminCreate) -> Admin:
    hashed_password = security.get_password_hash(admin.password)
    db_admin = Admin(
        username=admin.username, hashed_password=hashed_password, email=admin.email
    )
    session.add(db_admin)
    await session.commit()
    await session.refresh(db_admin)
    return db_admin


async def authenticate_admin(
    session: AsyncSession, username: str, password: str
) -> Admin | None:
    admin = await get_admin_by_username(session=session, username=username)
    if not admin:
        return None
    if not security.verify_password(password, admin.hashed_password):
        return None
    return admin
