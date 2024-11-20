import httpx
from aiogram import Router, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message

from src.database import db_manager
from src.gpt_chat.services import (
    ask_chatgpt,
    get_gpt_messages_by_user_id,
    clear_history,
)
from src.users.service import get_user_by_tg_username

router = Router()


@router.message(Command("ask"))
async def handle_ask_command(message: Message):
    try:
        user_prompt = message.text.split(maxsplit=1)[1]  # Получаем текст после команды
        if not user_prompt:
            raise ValueError
    except (IndexError, ValueError) as e:
        await message.answer("Пожалуйста, введите вопрос после команды /ask")
        return

    bot_message = await message.answer("Запрос отправлен, подождите...")

    try:
        response = await ask_chatgpt(
            prompt=user_prompt, tg_username=message.from_user.username
        )
        await bot_message.edit_text(response, parse_mode="Markdown")
    except Exception as e:
        await bot_message.edit_text(f"Ошибка: {e}")


@router.message(Command("history"))
async def handle_history_command(message: Message):
    try:
        async with db_manager.session_maker() as session:
            user = await get_user_by_tg_username(
                session=session, tg_username="@" + message.from_user.username
            )
            messages = await get_gpt_messages_by_user_id(
                session=session, user_id=user.id, limit=32
            )
            answer = ""
            for gpt_message in messages:
                answer += f"({gpt_message.created_at}) {gpt_message.content}\n\n"
            await message.answer(answer if answer else "Пусто")
    except Exception as e:
        await message.answer(f"Ошибка: {e}")


@router.message(Command("clear"))
async def handle_history_clear(message: Message):
    try:
        async with db_manager.session_maker() as session:
            await clear_history(session=session, tg_username=message.from_user.username)
        await message.answer("История очищена")
    except Exception as e:
        await message.answer(f"Ошибка: {e}")


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
