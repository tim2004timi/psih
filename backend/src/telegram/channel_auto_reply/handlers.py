import json
from time import time

from aiogram import Router, F, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Message, PhotoSize, ContentType, InlineKeyboardButton, InlineKeyboardMarkup, InputFile, \
    CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State

from src.telegram.utils import permission_decorator, Permission, grouper
from src.database import db_manager
from src.channel_auto_reply.service import create_or_update_channel_auto_reply, get_channel_auto_reply


router = Router()
timer = time()


class AdminAutoReplyStates(StatesGroup):
    waiting_for_photo = State()
    waiting_for_text = State()
    waiting_for_buttons = State()

@router.callback_query(F.data == "channel_auto_reply")
@permission_decorator(Permission.ADMIN)
async def cmd_set_auto_reply_photo(callback: CallbackQuery, state: FSMContext):
    await callback.message.answer("Пришлите фото (одним сообщением).")
    await state.set_state(AdminAutoReplyStates.waiting_for_photo)
    await callback.answer()

@router.message(F.content_type == ContentType.PHOTO, AdminAutoReplyStates.waiting_for_photo)
async def handle_photo(message: Message, state: FSMContext):
    # Получаем объект PhotoSize (последний размер)
    photo: types.PhotoSize = message.photo[-1]

    # Получаем file_id
    file_id = photo.file_id

    # Сохраняем file_id в базе данных
    async with db_manager.session_maker() as session:
        await create_or_update_channel_auto_reply(
            session=session,
            photo_file_id=file_id,  # Сохраняем только file_id
            text=None,  # не обновляем
            buttons=None,
        )
    await message.answer("Отправьте текст, который будет в автоответе.")
    await state.set_state(AdminAutoReplyStates.waiting_for_text)
    # await state.clear()

# @router.message(Command("set_auto_reply_text"))
# @permission_decorator(Permission.ADMIN)
# async def cmd_set_auto_reply_text(message: Message, state: FSMContext):
#     await message.answer("Отправьте текст, который будет в автоответе.")
#     await state.set_state(AdminAutoReplyStates.waiting_for_text)

@router.message(AdminAutoReplyStates.waiting_for_text)
async def handle_text(message: Message, state: FSMContext):
    text = message.text

    async with db_manager.session_maker() as session:
        await create_or_update_channel_auto_reply(
            session=session,
            photo_file_id=None,  # не обновляем фото
            text=text,
            buttons=None,
        )

    example = """Пришлите JSON-массив кнопок, например:
[
  {"text": "Google", "url": "https://google.com"},
  {"text": "GitHub", "url": "https://github.com"}
]"""
    await message.answer(f"Отправьте кнопки в формате JSON.\nПример: {example}")
    await state.set_state(AdminAutoReplyStates.waiting_for_buttons)
    # await state.clear()

# @router.message(Command("set_auto_reply_buttons"))
# @permission_decorator(Permission.ADMIN)
# async def cmd_set_auto_reply_buttons(message: Message, state: FSMContext):
#     example = """
# Пришлите JSON-массив кнопок, например:
# [
#   {"text": "Google", "url": "https://google.com"},
#   {"text": "GitHub", "url": "https://github.com"}
# ]
#     """
#     await message.answer(f"Отправьте кнопки в формате JSON.\nПример: {example}")
#     await state.set_state(AdminAutoReplyStates.waiting_for_buttons)

@router.message(AdminAutoReplyStates.waiting_for_buttons)
async def handle_buttons(message: Message, state: FSMContext):
    try:
        data = json.loads(message.text)
        # Проверим, что это список
        if not isinstance(data, list):
            raise ValueError("Должен быть список JSON-объектов.")

        async with db_manager.session_maker() as session:
            await create_or_update_channel_auto_reply(
                session=session,
                photo_file_id=None,  # не обновляем фото
                text=None,
                buttons=data,
            )
        await message.answer("Конфиг задан!")

        async with db_manager.session_maker() as session:
            config = await get_channel_auto_reply(session)

        kb = None
        if config.buttons:
            row = []
            for btn in config.buttons:
                text = btn.get("text", "Button")
                url = btn.get("url", "#")
                row.append(InlineKeyboardButton(text=text, url=url))
            keyboard_rows = [list(filter(None, group)) for group in grouper(row, 2)]
            kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

        # Если есть фото, отправляем его как комментарий
        if config.photo_file_id:
            await message.bot.send_photo(
                chat_id=message.chat.id,  # Отправляем в чат обсуждений
                photo=config.photo_file_id,  # Используем file_id изображения
                caption=config.text or "",  # Добавляем текст (если есть)
                reply_markup=kb  # Кнопки (если есть)
            )
        else:
            # Если фото нет, отправляем текст в комментарий
            await message.bot.send_message(
                chat_id=message.chat.id,  # Отправляем в чат обсуждений
                text=config.text or "",  # Текст для комментария
                reply_markup=kb  # Кнопки (если есть)
            )
    except Exception as e:
        await message.answer(f"Ошибка парсинга JSON: {e}")
    await state.clear()


@router.message()
async def handle_channel_post(message: Message):
    global timer
    if not message.is_automatic_forward:
        return
    async with db_manager.session_maker() as session:
        config = await get_channel_auto_reply(session)
    if not config:
        return

    if time() - timer < 0.5:
        return

    timer = time()

    kb = None
    if config.buttons:
        row = []
        for btn in config.buttons:
            text = btn.get("text", "Button")
            url = btn.get("url", "#")
            row.append(InlineKeyboardButton(text=text, url=url))
        keyboard_rows = [list(filter(None, group)) for group in grouper(row, 2)]
        kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    # Если есть фото, отправляем его как комментарий
    if config.photo_file_id:
        await message.bot.send_photo(
            chat_id=message.chat.id,  # Отправляем в чат обсуждений
            photo=config.photo_file_id,  # Используем file_id изображения
            caption=config.text or "",  # Добавляем текст (если есть)
            reply_to_message_id=message.message_id,  # Отправляем как комментарий под новым постом
            reply_markup=kb  # Кнопки (если есть)
        )
    else:
        # Если фото нет, отправляем текст в комментарий
        await message.bot.send_message(
            chat_id=message.chat.id,  # Отправляем в чат обсуждений
            text=config.text or "",  # Текст для комментария
            reply_to_message_id=message.message_id,  # Отправляем как комментарий под новым постом
            reply_markup=kb  # Кнопки (если есть)
        )



def register_handlers(dp: Dispatcher):
    dp.include_router(router)