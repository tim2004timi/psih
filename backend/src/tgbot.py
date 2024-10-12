import asyncio

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from fastapi import HTTPException
from redis.asyncio import Redis

from .users.service import get_user_by_tg_username
from .config import settings
from .database import db_manager


dp = Dispatcher()

# Инициализация Redis клиента
redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)


@dp.message(CommandStart())
async def start_command(message: types.Message):
    async with db_manager.session_maker() as session:
        try:
            tg_username = "@" + message.from_user.username
            user = await get_user_by_tg_username(
                tg_username=tg_username, session=session
            )
        except HTTPException:
            await message.answer(
                "Вы не зарегистрированы в системе psih, зарегистрируйтесь и повторите попытку!"
            )
            return
        await redis_client.set(f"telegram_chat_id:{user.username}", message.chat.id)
        await message.answer(
            f"Добро пожаловать! Ваш аккаунт привязан к chat ID {message.chat.id}. Теперь вы можете получать 2FA коды."
        )
        await session.close()


async def main() -> None:
    bot = Bot(token=settings.bot_token)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
