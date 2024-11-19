import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties

from src.config import settings
from .handlers import register_handlers as register_main_handlers
from .collections.handlers import register_handlers as register_collection_handlers
from .business_notes.handlers import (
    register_handlers as register_business_notes_handlers,
)
from .openai.handlers import register_handlers as register_openai_handlers
from src import main as fastapi_main


commands = [
    types.BotCommand(command="/start", description="Начать"),
    types.BotCommand(command="/menu", description="Меню"),
    types.BotCommand(command="/help", description="Помощь"),
    types.BotCommand(command="/about", description="О боте"),
]


async def main() -> None:
    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode="HTML"),
    )
    dp = Dispatcher()
    print("Бот запущен!")

    register_main_handlers(dp)
    register_collection_handlers(dp)
    register_business_notes_handlers(dp)
    register_openai_handlers(dp)
    await bot.set_my_commands(commands)

    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
