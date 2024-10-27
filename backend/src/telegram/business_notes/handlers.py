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
)
from src.database import db_manager
from src.telegram.utils import (
    edit_message,
    convert_to_moscow_time,
    permission_decorator,
    Permission,
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
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Назад", callback_data="menu")],
        ]
    )
    async with db_manager.session_maker() as session:
        tg_username = "@" + callback.from_user.username
        user = await get_user_by_tg_username(session=session, tg_username=tg_username)
        notes = await get_business_notes_by_user_id(session=session, user_id=user.id)

    message = "🗒 <b>Ваши личные записи\n💰 Всего: {0} ₽</b>\n\n"

    summ = 0
    for note in notes:
        summ += note.amount
        message += f"🕒<b><i> {convert_to_moscow_time(note.created_at)}</i></b>\n"
        message += f"Сумма: {note.amount} ₽\n"
        message += f"Описание: {note.name}\n\n"

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
    if not amount.isdigit():
        await message.answer("🚫 <b>Неверная сумма</b>\nВведите сумму еще раз")
        return
    await state.update_data(amount=int(amount))
    await state.set_state(BusinessNoteState.name)
    await message.answer("🔖 Введите комментарий:")


@router.message(BusinessNoteState.name)
@permission_decorator(Permission.ADMIN)
async def business_note_name_state(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    data = await state.get_data()

    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📋 Меню", callback_data="menu")],
            [
                InlineKeyboardButton(
                    text="Назад", callback_data="business-notes"
                )
            ],
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


def register_handlers(dp: Dispatcher):
    dp.include_router(router)
