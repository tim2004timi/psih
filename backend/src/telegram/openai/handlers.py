from aiogram import Router, Dispatcher, F
from aiogram.fsm.context import FSMContext
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)
from aiogram.fsm.state import StatesGroup, State

from src.database import db_manager
from src.gpt_chat.services import (
    ask_chatgpt,
    get_gpt_messages_by_user_id,
    clear_history,
)
from src.telegram.utils import edit_message, permission_decorator, Permission
from src.users.service import get_user_by_tg_username

router = Router()


class GPTChatState(StatesGroup):
    chat = State()


@router.callback_query(F.data == "gpt_menu")
@permission_decorator(Permission.ALL)
@edit_message
async def gpt_menu_callback(
    callback: CallbackQuery, state: FSMContext
) -> tuple[str, InlineKeyboardMarkup]:
    async with db_manager.session_maker() as session:
        user = await get_user_by_tg_username(
            session=session, tg_username="@" + callback.from_user.username
        )
        messages = await get_gpt_messages_by_user_id(
            session=session, user_id=user.id, limit=10**3
        )
    answer = "🤖 <b>AI Ассистент</b>\n"
    answer += f"📊 <b>Всего сообщений: {len(messages)} шт.</b>\n\n"
    answer += "Напиши любой текст, и ваш помощник ответит вам"

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🕓 История", callback_data="gpt_history"),
                InlineKeyboardButton(
                    text="❌ Очистить историю", callback_data="clear_gpt_history"
                ),
            ],
            [InlineKeyboardButton(text="Назад", callback_data="menu")],
        ]
    )
    await state.set_state(GPTChatState.chat)
    return answer, inline_keyboard


@router.message(GPTChatState.chat)
@permission_decorator(Permission.ALL)
async def ask_gpt_state(message: Message):
    bot_message = await message.answer("Запрос отправлен, подождите...")
    try:
        response = await ask_chatgpt(
            prompt=message.text, tg_username=message.from_user.username
        )
        answer = response + "\n\n/menu - меню"
        await bot_message.edit_text(answer, parse_mode="Markdown")
    except Exception as e:
        await bot_message.edit_text(f"Ошибка: {e}")


@router.callback_query(F.data == "clear_gpt_history")
@permission_decorator(Permission.ALL)
async def history_clear_callback(callback: CallbackQuery):
    try:
        async with db_manager.session_maker() as session:
            await clear_history(
                session=session, tg_username=callback.from_user.username
            )
        await callback.answer("История очищена")
        await gpt_menu_callback(callback)
    except Exception as e:
        await callback.answer(f"Ошибка: {e}")


@router.callback_query(F.data == "gpt_history")
@permission_decorator(Permission.ALL)
@edit_message
async def history_callback(callback: CallbackQuery) -> tuple[str, InlineKeyboardMarkup]:
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="❌ Очистить историю", callback_data="clear_gpt_history"
                ),
            ],
            [InlineKeyboardButton(text="Назад", callback_data="menu")],
        ]
    )
    try:
        async with db_manager.session_maker() as session:
            user = await get_user_by_tg_username(
                session=session, tg_username="@" + callback.from_user.username
            )
            messages = await get_gpt_messages_by_user_id(
                session=session, user_id=user.id, limit=32
            )
            answer = ""
            for gpt_message in messages:
                answer += f"({gpt_message.created_at}) {gpt_message.content}\n\n"

            return answer if answer else "Пусто", inline_keyboard

    except Exception as e:
        return f"Ошибка: {e}", inline_keyboard


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
