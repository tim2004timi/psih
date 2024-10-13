import random

from fastapi import Depends, HTTPException, Form
from redis.asyncio import Redis
from aiogram import Bot
from sqlalchemy.ext.asyncio import AsyncSession

from .dependencies import validate_auth_user
from .schemas import VerifyCodeRequest
from ..config import settings, auth_settings
from ..database import db_manager
from ..users.schemas import User as UserSchema
from ..users.service import get_user_by_username

# Инициализация Redis клиента
redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)

bot = Bot(token=settings.bot_token)


async def login(user: UserSchema = Depends(validate_auth_user)):
    # Генерация 2FA кода
    code = str(random.randint(100000, 999999))

    # Сохранение кода и количества попыток в Redis с истечением срока действия
    await redis_client.set(
        f"2fa_code:{user.username}", code, ex=auth_settings.tg_bot_code_expire_seconds
    )
    await redis_client.set(
        f"2fa_attempts:{user.username}", 0, ex=auth_settings.tg_bot_code_expire_seconds
    )

    # Получение chat_id из Redis
    chat_id = await redis_client.get(f"telegram_chat_id:{user.username}")
    if chat_id is None:
        raise HTTPException(
            status_code=400,
            detail="Telegram-аккаунт не привязан. Пожалуйста, начните диалог с ботом для привязки аккаунта.",
        )

    # Отправка кода через Telegram-бота
    await bot.send_message(
        chat_id=int(chat_id),
        text=f"Ваш 2FA код: <code>{code}</code>",
        parse_mode="HTML",
    )

    return {"message": "2FA код отправлен через Telegram"}


async def verify_code(
    username: Form(),
    code: Form(),
    session: AsyncSession = Depends(db_manager.session_dependency),
):
    request = VerifyCodeRequest(username=username, code=code)
    # Получение сохраненного кода и количества попыток из Redis
    code = await redis_client.get(f"2fa_code:{request.username}")
    attempts = await redis_client.get(f"2fa_attempts:{request.username}")

    if code is None:
        raise HTTPException(status_code=400, detail="2FA код не найден или истек")

    attempts = int(attempts)

    if attempts >= auth_settings.tg_bot_code_max_attempts:
        raise HTTPException(
            status_code=403, detail="Превышено максимальное количество попыток"
        )

    if request.code == code:  # Успешный вход
        await redis_client.delete(f"2fa_code:{request.username}")
        await redis_client.delete(f"2fa_attempts:{request.username}")

        # Отправка уведомления о входе через Telegram-бота
        chat_id = await redis_client.get(f"telegram_chat_id:{request.username}")
        await bot.send_message(
            chat_id=int(chat_id),
            text=f"В ваш аккаунт <i><b>{request.username}</b></i> произведен вход",
            parse_mode="HTML",
        )

        return await get_user_by_username(session=session, username=request.username)
    else:
        # Увеличение количества попыток
        attempts += 1
        await redis_client.set(f"2fa_attempts:{request.username}", attempts)
        raise HTTPException(status_code=401, detail="Неверный 2FA код")
