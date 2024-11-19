from aiogram import Router, F, Dispatcher
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    Message,
)

from src.business_notes.schemas import BusinessNoteCreate
from src.business_notes.service import (
    get_business_notes_by_user_id,
    create_business_note,
    get_business_note_by_id,
    delete_business_note,
    get_all_business_notes,
)
from src.database import db_manager
from src.telegram.utils import (
    edit_message,
    convert_to_moscow_time,
    permission_decorator,
    Permission,
    grouper,
)
from src.users.service import get_user_by_tg_username

router = Router()


class BusinessNoteState(StatesGroup):
    amount = State()
    name = State()
    user_id = State()


@router.callback_query(F.data == "business-notes")
@permission_decorator(Permission.ADMIN)
@edit_message
async def business_notes_callback(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    async with db_manager.session_maker() as session:
        tg_username = "@" + callback.from_user.username
        user = await get_user_by_tg_username(session=session, tg_username=tg_username)
        notes = await get_business_notes_by_user_id(session=session, user_id=user.id)

    message = "🗒 <b>Ваши личные записи\n💰 Всего: {0} ₽</b>\n\n"

    summ = 0
    for note in notes:
        summ += note.amount
        message += f"🕒<b><i> {convert_to_moscow_time(note.created_at)}</i></b>\n"
        message += f"Сумма: {note.amount} ₽\n" \
                   f"\n"
        # message += f"Описание: {note.name}\n\n" TODO: change

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✏️ Добавить запись",
                    callback_data=f"add-business-note_{user.id}",
                )
            ],
            [
                InlineKeyboardButton(
                    text="❌ Удалить запись",
                    callback_data=f"rm-choice-business-note_{user.id}",
                )
            ],
            [
                InlineKeyboardButton(
                    text="❔ Записи других", callback_data=f"other-business-notes"
                )
            ],
            [InlineKeyboardButton(text="Назад", callback_data="menu")],
        ]
    )

    return message.format(summ), inline_keyboard


@router.callback_query(F.data.startswith("add-business-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def add_business_note_first_step(
    callback: CallbackQuery, state: FSMContext
) -> tuple[str, InlineKeyboardMarkup | None]:
    user_id = int(callback.data.split("_")[1])
    await state.update_data(user_id=user_id)
    await state.set_state(BusinessNoteState.amount)
    return "💰 Введите сумму:", None


@router.message(BusinessNoteState.amount)
@permission_decorator(Permission.ADMIN)
async def business_note_amount_state(message: Message, state: FSMContext):
    amount = message.text
    try:
        amount = int(amount)
    except ValueError:
        await message.answer("🚫 <b>Неверная сумма</b>\nВведите сумму еще раз")
        return

    await state.update_data(amount=int(amount))
    # await state.set_state(BusinessNoteState.name)
    # await message.answer("🔖 Введите комментарий:")
    # TODO: Изменить, когда нужен будет комментарий
    await state.update_data(name="")
    data = await state.get_data()

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🗒 Ваши личные записи", callback_data="business-notes"
                )
            ],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            note_create = BusinessNoteCreate(
                name=data["name"],
                amount=data["amount"],
                user_id=data["user_id"],
            )
            await create_business_note(
                session=session, business_note_create=note_create
            )
    except Exception as e:
        await message.answer(
            f"❌ Запись не записана! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
            reply_markup=inline_keyboard,
        )
        return
    await message.answer("✅ Запись создана успешно!", reply_markup=inline_keyboard)
    await state.clear()


# @router.message(BusinessNoteState.name)
# @permission_decorator(Permission.ADMIN)
# async def business_note_name_state(message: Message, state: FSMContext):
#     await state.update_data(name=message.text)
#     data = await state.get_data()
#
#     inline_keyboard = InlineKeyboardMarkup(
#         inline_keyboard=[
#             [
#                 InlineKeyboardButton(
#                     text="🗒 Ваши личные записи", callback_data="business-notes"
#                 )
#             ],
#             [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
#         ]
#     )
#
#     try:
#         async with db_manager.session_maker() as session:
#             note_create = BusinessNoteCreate(
#                 name=data["name"],
#                 amount=data["amount"],
#                 user_id=data["user_id"],
#             )
#             await create_business_note(
#                 session=session, business_note_create=note_create
#             )
#     except Exception as e:
#         await message.answer(
#             f"❌ Запись не записана! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
#             reply_markup=inline_keyboard,
#         )
#         return
#     await message.answer("✅ Запись создана успешно!", reply_markup=inline_keyboard)
#     await state.clear()


@router.callback_query(F.data.startswith("rm-choice-business-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def choose_remove_business_note(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    user_id = int(callback.data.split("_")[1])
    async with db_manager.session_maker() as session:
        notes = await get_business_notes_by_user_id(session=session, user_id=user_id)

    i = 0
    summ = 0
    message = "🗒 <b>Ваши личные записи\n💰 Всего: {0} ₽</b>\n\n"
    while i < len(notes):
        message += (
            f"<b><i>{i+1}) 🕒 {convert_to_moscow_time(notes[i].created_at)} </i></b>\n"
        )
        message += f"    Сумма: {notes[i].amount} ₽\n" \
                   f"\n"
        # message += f"    Описание: {notes[i].name}\n\n" TODO: change
        summ += notes[i].amount
        i += 1
    message += "<i>Выберете номер записи, которую хотите удалить</i>"
    buttons = [
        InlineKeyboardButton(
            text=str(index + 1),
            callback_data=f"rm-business-note_{note.id}",
        )
        for index, note in enumerate(notes)
    ]

    keyboard_rows = [list(filter(None, group)) for group in grouper(buttons, 2)]

    back_button = [
        InlineKeyboardButton(text="Назад", callback_data=f"business-notes"),
    ]
    keyboard_rows.append(back_button)

    notes_keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)

    return message.format(summ), notes_keyboard


@router.callback_query(F.data.startswith("rm-business-note"))
@permission_decorator(Permission.ADMIN)
@edit_message
async def remove_business_note(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    note_id = int(callback.data.split("_")[1])
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🗒 Ваши личные записи", callback_data="business-notes"
                )
            ],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )

    try:
        async with db_manager.session_maker() as session:
            note = await get_business_note_by_id(
                session=session, business_note_id=note_id
            )
            await delete_business_note(session=session, business_note=note)
    except Exception as e:
        return (
            f"❌ Запись не удалена! \nОшибка:\n<tg-spoiler>{e}</tg-spoiler>",
            inline_keyboard,
        )

    return "✅ Запись удалена успешно!", inline_keyboard


@router.callback_query(F.data == "other-business-notes")
@permission_decorator(Permission.ADMIN)
@edit_message
async def other_business_notes_callback(
    callback: CallbackQuery,
) -> tuple[str, InlineKeyboardMarkup | None]:
    users_notes = {}
    async with db_manager.session_maker() as session:
        notes = await get_all_business_notes(session=session)
    for note in notes:
        if note.user.tg_username == "@" + callback.from_user.username:
            continue
        if note.user not in users_notes:
            users_notes[note.user] = [note]
        else:
            users_notes[note.user].append(note)

    message = ""
    for user in users_notes:
        summ = 0
        message += "ℹ️ <b>Пользователь: {0}\n💰 Всего: {1} ₽</b>\n\n"
        for note in users_notes[user]:
            summ += note.amount
            message += f"🕒<b><i> {convert_to_moscow_time(note.created_at)}</i></b>\n"
            message += f"Сумма: {note.amount} ₽\n" \
                       f"\n"
            # message += f"Описание: {note.name}\n\n" TODO: change
        message = message.format(user.username, summ)

    if not message:
        message = "<i>Пусто</i>"

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🗒 Ваши личные записи", callback_data="business-notes"
                )
            ],
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
        ]
    )
    return message, inline_keyboard


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
