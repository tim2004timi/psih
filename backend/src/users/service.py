from fastapi import HTTPException, Depends
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from starlette import status

from . import models, schemas
from .models import User
from ..database import db_manager
from ..utils import hash_password


async def get_user_by_id(session: AsyncSession, user_id: int) -> User:
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с ID ({user_id}) не найден",
        )
    return user


async def get_user_by_username(session: AsyncSession, username: str) -> User:
    stmt = select(User).where(User.username == username)
    result: Result = await session.execute(stmt)
    user = result.scalars().one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с username ({username}) не найден",
        )
    return user


async def get_user_by_tg_username(tg_username: str, session: AsyncSession) -> User:
    stmt = select(User).where(User.tg_username == tg_username)
    result: Result = await session.execute(stmt)
    user = result.scalars().one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с tg_username ({tg_username}) не найден",
        )
    return user


async def create_user(session: AsyncSession, user: schemas.UserCreate) -> User:
    hashed_password = hash_password(user.password)
    user = User(
        username=user.username, hashed_password=hashed_password, tg_username=user.tg_username
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
