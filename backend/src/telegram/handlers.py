from functools import reduce

from aiogram import Dispatcher, Router, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)
from aiogram.utils.formatting import Text
from redis.asyncio import Redis

from .keyboards import menu_inline_keyboard, menu_reply_keyboard
from .utils import (
    permission_decorator,
    Permission,
    get_user_from_system,
    delete_and_send_new_message,
    grouper,
    convert_to_moscow_time,
)
from src.collections.service import (
    get_collections,
    get_collection_notes_by_collection_id,
    create_collection_note,
)
from ..collections.schemas import CollectionNoteCreate
from ..database import db_manager


class NoteState(StatesGroup):
    amount = State()
    name = State()
    collection_id = State()


redis_client = Redis(host="localhost", port=6379, db=0, decode_responses=True)
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
@delete_and_send_new_message
async def menu_callback(callback: CallbackQuery):
    await menu(event=callback)


@router.message(F.text == "📋 Меню")
async def menu_message(message: Message):
    await menu(event=message)


@router.callback_query(F.data == "collections")
@permission_decorator(Permission.ADMIN)
@delete_and_send_new_message
async def collections_callback(callback: CallbackQuery):
    async with db_manager.session_maker() as session:
        collections = await get_collections(session=session)

    # Создаем кнопки для коллекций
    buttons = [
        InlineKeyboardButton(
            text=collection.name,
            callback_data=f"collection_{collection.name}_{collection.id}",
        )
        for collection in collections
    ]

    keyboard_rows = [list(filter(None, group)) for group in grouper(buttons, 2)]

    back_button = [InlineKeyboardButton(text="Назад", callback_data="menu")]
    keyboard_rows.append(back_button)

    collections_keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    await callback.message.answer(
        "👕 <b>Коллекции:</b> ", reply_markup=collections_keyboard
    )
    await callback.answer()


@router.callback_query(F.data.startswith("collection_"))
@permission_decorator(Permission.ADMIN)
@delete_and_send_new_message
async def collection_detail_callback(callback: CallbackQuery):
    collection_name = callback.data.split("_")[1]
    collection_id = int(callback.data.split("_")[2])
    async with db_manager.session_maker() as session:
        notes = await get_collection_notes_by_collection_id(
            session=session, collection_id=collection_id
        )
    summ = 0
    message = "👕 <b>Коллекция: {0}\n💰 Всего: {1} ₽</b>\n\n"
    for note in notes:
        summ += note.amount
        message += f"🕒<b><i> {convert_to_moscow_time(note.created_at)}</i></b>\n"
        message += f"Сумма: {note.amount} ₽\n"
        message += f"Описание: {note.name}\n\n"

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✏️ Добавить запись", callback_data=f"add-note_{collection_id}"
                )
            ],
            [InlineKeyboardButton(text="Назад", callback_data="collections")],
        ]
    )

    await callback.message.answer(
        message.format(collection_name, summ), reply_markup=inline_keyboard
    )
    await callback.answer()


@router.callback_query(F.data.startswith("add-note"))
@permission_decorator(Permission.ADMIN)
@delete_and_send_new_message
async def add_note_first_step(callback: CallbackQuery, state: FSMContext):
    collection_id = int(callback.data.split("_")[1])
    await state.update_data(collection_id=collection_id)
    await state.set_state(NoteState.amount)
    await callback.message.answer("💰 Введите сумму:")
    await callback.answer()


@router.message(NoteState.amount)
@permission_decorator(Permission.ADMIN)
async def note_amount_state(message: Message, state: FSMContext):
    amount = message.text
    if not amount.isdigit():
        await message.answer("🚫 <b>Неверная сумма</b>\nВведите сумму еще раз")
        return
    await state.update_data(amount=int(amount))
    await state.set_state(NoteState.name)
    await message.answer("🔖 Введите комментарий:")


@router.message(NoteState.name)
@permission_decorator(Permission.ADMIN)
async def note_name_state(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    data = await state.get_data()

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="👕 Коллекции", callback_data="collections")],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            note_create = CollectionNoteCreate(
                name=data["name"],
                amount=data["amount"],
                collection_id=data["collection_id"],
            )
            await create_collection_note(
                session=session, collection_note_create=note_create
            )
    except Exception as e:
        await message.answer(
            f"❌ Запись не записана! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
            reply_markup=inline_keyboard,
        )
        return
    await message.answer("✅ Запись создана успешно!", reply_markup=inline_keyboard)
    await state.clear()


@router.callback_query(F.data == "something")
@delete_and_send_new_message
async def something_callback(callback: CallbackQuery):
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Назад", callback_data="menu")],
        ]
    )
    await callback.message.answer(
        "🔞🔞🔞🔞🔞🔞\nЖЕСТКИЙ СЕКС В МАЙНКРАФТЕ\n🔞🔞🔞🔞🔞🔞",
        reply_markup=inline_keyboard,
    )
    await callback.answer()


# @router.callback_query(F.data == "registration")
# async def collections_callback(callback: CallbackQuery, state: FSMContext):
#     await callback.message.answer("Логин:")
#     await state.set_state(RegistrationState.login)
#     await callback.answer()
#
#
# @router.message(RegistrationState.login)
# async def login_state(message: Message, state: FSMContext):
#     login = message.text
#     await state.update_data(login=login)
#     await state.set_state(RegistrationState.password)
#     await message.answer("Пароль:")
#
#
# @router.message(RegistrationState.password)
# async def password_state(message: Message, state: FSMContext):
#     password = message.text
#     await state.update_data(password=password)
#     data = await state.get_data()
#     await message.answer(
#         f"Успешно!\nЛогин: {data['login']}\nПароль: {data['password']}",
#         reply_markup=menu_reply_keyboard,
#     )
#     await state.clear()


async def menu(event):
    user = await get_user_from_system(event=event)
    message = "<b>➖PSIHSYSTEM➖</b>"
    if user:
        message += f"\n\nПользователь: <b><i>{user.username}</i></b>\nАдмин: "
        admin = "✅" if user.admin else "❌"
        message += admin
    if isinstance(event, CallbackQuery):
        await event.message.answer(message, reply_markup=menu_inline_keyboard)
        await event.answer()
    elif isinstance(event, Message):
        await event.answer(message, reply_markup=menu_inline_keyboard)


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
