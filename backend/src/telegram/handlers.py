from aiogram import Dispatcher, Router, F
from aiogram.filters import Command
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
)

from .redisdb import redis_client

from .keyboards import menu_inline_keyboard, menu_reply_keyboard
from .utils import (
    get_user_from_system,
    edit_message,
)

router = Router()


@router.message(Command("start"))
async def cmd_start(message: Message):
    user = await get_user_from_system(event=message)
    if not user:
        return
    await redis_client.set(f"telegram_chat_id:{user.username}", message.chat.id)
    await message.answer(
        f"Добро пожаловать! Ваш аккаунт привязан к chat ID {message.chat.id}. Теперь вы можете получать 2FA коды.",
        reply_markup=menu_reply_keyboard,
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    await menu(event=message)


@router.callback_query(F.data == "menu")
@edit_message
async def menu_callback(callback: CallbackQuery) -> tuple[str, InlineKeyboardMarkup]:
    return await menu(event=callback)


@router.message(F.text == "📋 Меню")
async def menu_message(message: Message):
    await menu(event=message)


async def menu(event) -> None | tuple[str, InlineKeyboardMarkup]:
    user = await get_user_from_system(event=event)
    message = "<b>➖PSIHSYSTEM➖</b>"
    if user:
        message += f"\n\nПользователь: <b><i>{user.username}</i></b>\nАдмин: "
        admin = "✅" if user.admin else "❌"
        message += admin
    if isinstance(event, CallbackQuery):
        return message, menu_inline_keyboard
    elif isinstance(event, Message):
        await event.answer(message, reply_markup=menu_inline_keyboard)


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
