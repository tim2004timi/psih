import random

from fastapi import Depends, HTTPException
from redis.asyncio import Redis
from aiogram import Bot

from .dependencies import validate_auth_user
from .schemas import VerifyCodeRequest
from ..config import settings
from ..users.schemas import User as UserSchema

# Инициализация Redis клиента
redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)

bot = Bot(token=settings.bot_token)


async def login(user: UserSchema = Depends(validate_auth_user)):
    # Генерация 2FA кода
    code = str(random.randint(100000, 999999))

    # Сохранение кода и количества попыток в Redis с истечением срока действия
    await redis_client.set(f"2fa_code:{user.username}", code, ex=300)
    await redis_client.set(f"2fa_attempts:{user.username}", 0, ex=300)

    # Получение chat_id из Redis
    chat_id = await redis_client.get(f"telegram_chat_id:{user.username}")
    if chat_id is None:
        raise HTTPException(
            status_code=400,
            detail="Telegram-аккаунт не привязан. Пожалуйста, начните диалог с ботом и привяжите свой аккаунт.",
        )

    # Отправка кода через Telegram-бота
    await bot.send_message(chat_id=int(chat_id), text=f"Ваш 2FA код: {code}")

    return {"message": "2FA код отправлен через Telegram"}


async def verify_code(request: VerifyCodeRequest):
    # Получение сохраненного кода и количества попыток из Redis
    code = await redis_client.get(f"2fa_code:{request.username}")
    attempts = await redis_client.get(f"2fa_attempts:{request.username}")

    if code is None:
        raise HTTPException(status_code=400, detail="2FA код не найден или истек")

    attempts = int(attempts)

    if attempts >= 5:
        raise HTTPException(
            status_code=403, detail="Превышено максимальное количество попыток"
        )

    if request.code == code:
        # Успешный вход
        await redis_client.delete(f"2fa_code:{request.username}")
        await redis_client.delete(f"2fa_attempts:{request.username}")

        return {"message": "Успешный вход"}
    else:
        # Увеличение количества попыток
        attempts += 1
        await redis_client.set(f"2fa_attempts:{request.username}", attempts)
        raise HTTPException(status_code=401, detail="Неверный 2FA код")
