from fastapi import HTTPException
from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from . import schemas
from .models import User
from .schemas import UserUpdatePartial, UserMeUpdatePartial
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
    try:
        await get_user_by_tg_username(tg_username=user.tg_username, session=session)
    except HTTPException:
        pass
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Пользователь с tg_username ({user.tg_username}) уже существует",
        )
    hashed_password = hash_password(user.password)
    user = User(
        username=user.username,
        hashed_password=hashed_password,
        tg_username=user.tg_username,
        access_storage=user.access_storage,
        access_crm=user.access_crm,
        access_message=user.access_message,
        access_analytics=user.access_analytics,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_users(session: AsyncSession) -> list[User]:
    stmt = select(User).where(User.admin == False)
    result: Result = await session.execute(stmt)
    users = result.scalars().all()
    return list(users)


async def update_user(
    session: AsyncSession,
    user: User,
    user_update: UserUpdatePartial | UserMeUpdatePartial,
) -> User:
    for name, value in user_update.model_dump(exclude_unset=True).items():
        if name == "password":
            user.hashed_password = hash_password(value)
        if user.admin and name == "active":  # нельзя админу поменять active
            continue
        setattr(user, name, value)
    await session.commit()
    return user


async def delete_user(session: AsyncSession, user: User) -> User:
    await session.delete(user)
    await session.commit()
    return user
