import asyncio

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from fastapi import HTTPException
from redis.asyncio import Redis

from .users.service import get_user_by_tg_username
from .config import settings

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
)


class DatabaseManager:
    def __init__(self):
        url = (
            f"postgresql+asyncpg://{settings.db_user}:{settings.db_pass}@{settings.db_host}:{settings.db_port}/"
            f"{settings.db_name}"
        )
        self.engine = create_async_engine(url=url, echo=settings.db_echo)
        self.session_maker = async_sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )


db_manager = DatabaseManager()
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
                "Ваш аккаунт не привязан к профилю в системе psih! Привяжите ваш telegram-аккаунт и повторите попытку."
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
