from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    KeyboardButton,
)

menu_inline_keyboard = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="👕 Коллекции", callback_data="collections"),
            InlineKeyboardButton(
                text="🗒 Бизнес записи", callback_data="business-notes"
            ),
        ],
        [InlineKeyboardButton(text="🤖 AI Ассистент", callback_data="gpt_menu"),]
    ]
)

menu_reply_keyboard = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="📋 Меню")]],
    resize_keyboard=True,
)
