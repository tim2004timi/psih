import httpx
from aiogram import Router, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message

from src.config import settings, CHAT_GPT_ADMIN_RULE


router = Router()
API_URL = settings.proxy_url + "/v1/chat/completions"

chat_history = [
    {"role": "system", "content": CHAT_GPT_ADMIN_RULE}
]


async def ask_chatgpt(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.api_token}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "gpt-4o",
        "messages": [*chat_history, {"role": "user", "content": prompt}],
        "temperature": 0.5,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, headers=headers, json=data)
        response.raise_for_status()  # Выбрасывает ошибку, если запрос не удался
        chat_history.append({"role": "user", "content": prompt})
        assistant_message = response.json()["choices"][0]["message"]["content"]
        chat_history.append({"role": "assistant", "content": assistant_message})

        if len(chat_history) > 16:  # Храните максимум 16 сообщений
            chat_history.pop(1)  # Удаляем старые сообщения (не трогая "system")

        return assistant_message


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
        response = await ask_chatgpt(user_prompt)
        await bot_message.edit_text(response, parse_mode="Markdown")
    except Exception as e:
        await bot_message.edit_text(f"Ошибка: {e}")


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
