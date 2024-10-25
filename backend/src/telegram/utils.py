from datetime import datetime
from enum import Enum
from itertools import zip_longest

import pytz
from aiogram.types import CallbackQuery, Message
from functools import wraps
from fastapi import HTTPException

from src.telegram.keyboards import menu_reply_keyboard
from src.users.service import get_user_by_tg_username
from src.database import db_manager
from src.users.models import User


class Permission(Enum):
    ADMIN = 1


def permission_decorator(permission: Permission):
    def access_required(func):
        @wraps(func)
        async def wrapper(event, *args, **kwargs):
            if not isinstance(event, (CallbackQuery, Message)):
                return
            user = await get_user_from_system(event=event)
            if not user:
                return

            # Проверяем доступ пользователя
            if permission == permission.ADMIN and not user.admin:
                return await answer_deny(
                    event=event, message="Доступ разрешен только админу"
                )

            return await func(event, *args, **kwargs)

        return wrapper

    return access_required


async def get_user_from_system(event) -> User | None:
    async with db_manager.session_maker() as session:
        try:
            tg_username = "@" + event.from_user.username
            user = await get_user_by_tg_username(
                tg_username=tg_username, session=session
            )
        except HTTPException:
            message = (
                "Ваш аккаунт не привязан к профилю в системе psih! "
                "Привяжите ваш telegram-аккаунт и повторите попытку."
            )
            await answer_deny(event=event, message=message)
            return
        await session.close()
        return user


async def answer_deny(event, message: str) -> None:
    if isinstance(event, CallbackQuery):
        await event.message.answer(message, reply_markup=menu_reply_keyboard)
        await event.answer()
    elif isinstance(event, Message):
        await event.answer(message, reply_markup=menu_reply_keyboard)


def delete_and_send_new_message(func):
    @wraps(func)
    async def wrapper(callback: CallbackQuery, *args, **kwargs):
        await callback.message.delete()
        await func(callback, *args, **kwargs)
        await callback.answer()

    return wrapper


def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)


def convert_to_moscow_time(utc_dt: datetime):
    # Установка часового пояса UTC для входного времени
    utc_zone = pytz.timezone("UTC")
    moscow_zone = pytz.timezone("Europe/Moscow")

    # Перевод времени из UTC в московское время
    utc_dt = utc_zone.localize(utc_dt)
    moscow_dt = utc_dt.astimezone(moscow_zone)

    # Форматирование даты в нужный формат
    return moscow_dt.strftime("%d.%m %H:%M")
