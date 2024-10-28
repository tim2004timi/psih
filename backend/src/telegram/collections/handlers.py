from aiogram import F, Dispatcher, Router
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    Message,
)
from fastapi import HTTPException

from src.collections.schemas import CollectionCreate, CollectionNoteCreate
from src.collections.service import (
    get_collections,
    create_collection,
    get_collection_notes_by_collection_id,
    get_collection_note_by_id,
    delete_collection_note,
    create_collection_note,
    get_collection_by_id,
    delete_collection,
)
from src.database import db_manager
from src.telegram.utils import (
    permission_decorator,
    Permission,
    edit_message,
    grouper,
    convert_to_moscow_time,
)


router = Router()


class NoteState(StatesGroup):
    amount = State()
    name = State()
    collection_id = State()


class CollectionState(StatesGroup):
    name = State()


@router.callback_query(F.data == "collections")
@permission_decorator(Permission.ADMIN)
@edit_message
async def collections_callback(_: CallbackQuery) -> tuple[str, InlineKeyboardMarkup]:
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

    back_button = [
        [
            InlineKeyboardButton(
                text="✏️ Добавить коллекцию", callback_data="add-collection"
            )
        ],
        [
            InlineKeyboardButton(
                text="❌ Удалить коллекцию", callback_data="rm-choice-collection"
            )
        ],
        [InlineKeyboardButton(text="Назад", callback_data="menu")],
    ]
    keyboard_rows.extend(back_button)

    collections_keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    return "👕 <b>Коллекции:</b>", collections_keyboard


@router.callback_query(F.data == "add-collection")
@permission_decorator(Permission.ADMIN)
@edit_message
async def create_collection_callback(
    _: CallbackQuery,
    state: FSMContext,
) -> tuple[str, InlineKeyboardMarkup | None]:
    await state.set_state(CollectionState.name)
    return "🔖 Введите название коллекции:", None


@router.message(CollectionState.name)
@permission_decorator(Permission.ADMIN)
async def collection_name_state(message: Message, state: FSMContext):
    name = message.text

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="👕 Коллекции", callback_data="collections")],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            collection_create = CollectionCreate(name=name)
            await create_collection(
                session=session, collection_create=collection_create
            )
    except HTTPException:
        await message.answer(
            "🚫 <b>Такая коллекция уже есть</b>\nВведите название уникальной коллекции",
        )
        return

    await message.answer("✅ Коллекция создана успешно!", reply_markup=inline_keyboard)
    await state.clear()


@router.callback_query(F.data.startswith("collection_"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def collection_detail_callback(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
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
            [
                InlineKeyboardButton(
                    text="❌ Удалить запись",
                    callback_data=f"rm-choice-note_{collection_name}_{collection_id}",
                )
            ],
            [InlineKeyboardButton(text="Назад", callback_data="collections")],
        ]
    )
    return message.format(collection_name, summ), inline_keyboard


@router.callback_query(F.data.startswith("add-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def add_note_first_step(
    callback: CallbackQuery, state: FSMContext
) -> tuple[str, InlineKeyboardMarkup | None]:
    collection_id = int(callback.data.split("_")[1])
    await state.update_data(collection_id=collection_id)
    await state.set_state(NoteState.amount)
    return "💰 Введите сумму:", None


@router.callback_query(F.data.startswith("rm-choice-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def choose_remove_note(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    collection_name = callback.data.split("_")[1]
    collection_id = int(callback.data.split("_")[2])
    async with db_manager.session_maker() as session:
        notes = await get_collection_notes_by_collection_id(
            session=session, collection_id=collection_id
        )

    i = 0
    summ = 0
    message = "👕 <b>Коллекция: {0}\n💰 Всего: {1} ₽</b>\n\n"
    while i < len(notes):
        message += (
            f"<b><i>{i+1}) 🕒 {convert_to_moscow_time(notes[i].created_at)} </i></b>\n"
        )
        message += f"    Сумма: {notes[i].amount} ₽\n"
        message += f"    Описание: {notes[i].name}\n\n"
        summ += notes[i].amount
        i += 1
    message += "<i>Выберете номер записи, которую хотите удалить</i>"
    buttons = [
        InlineKeyboardButton(
            text=str(index + 1),
            callback_data=f"rm-note_{note.id}",
        )
        for index, note in enumerate(notes)
    ]

    keyboard_rows = [list(filter(None, group)) for group in grouper(buttons, 2)]

    back_button = [
        InlineKeyboardButton(
            text="Назад", callback_data=f"collection_{collection_name}_{collection_id}"
        )
    ]
    keyboard_rows.append(back_button)

    notes_keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    return message.format(collection_name, summ), notes_keyboard


@router.callback_query(F.data.startswith("rm-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def remove_note(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    note_id = int(callback.data.split("_")[1])
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="👕 Коллекции", callback_data="collections")],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            note = await get_collection_note_by_id(
                session=session, collection_note_id=note_id
            )
            await delete_collection_note(session=session, collection_note=note)
    except Exception as e:
        return (
            f"❌ Запись не удалена! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
            inline_keyboard,
        )

    return "✅ Запись удалена успешно!", inline_keyboard


@router.message(NoteState.amount)
@permission_decorator(Permission.ADMIN)
async def note_amount_state(message: Message, state: FSMContext):
    amount = message.text
    try:
        amount = int(amount)
    except ValueError:
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


@router.callback_query(F.data == "rm-choice-collection")
@permission_decorator(Permission.ADMIN)
@edit_message
async def choice_remove_collection(
    _: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    async with db_manager.session_maker() as session:
        collections = await get_collections(session=session)

    # Создаем кнопки для коллекций
    buttons = [
        InlineKeyboardButton(
            text=collection.name,
            callback_data=f"rm-collection_{collection.name}_{collection.id}",
        )
        for collection in collections
    ]

    keyboard_rows = [list(filter(None, group)) for group in grouper(buttons, 2)]

    back_button = [
        InlineKeyboardButton(text="Назад", callback_data="collections"),
    ]
    keyboard_rows.append(back_button)
    collections_keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    message = "👕 <b>Коллекции:</b>\n\n<i>Выберите объект для удаления</i>"

    return message, collections_keyboard


@router.callback_query(F.data.startswith("rm-collection"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def remove_collection(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    collection_id = int(callback.data.split("_")[2])
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="👕 Коллекции", callback_data="collections")],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            collection = await get_collection_by_id(
                session=session, collection_id=collection_id
            )
            await delete_collection(session=session, collection=collection)
    except Exception as e:
        return (
            f"❌ Коллекция не удалена! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
            inline_keyboard,
        )

    return "✅ Коллекция удалена успешно!", inline_keyboard


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
