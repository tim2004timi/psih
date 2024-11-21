from typing import List

import httpx
from sqlalchemy import select, Result, desc, delete
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import settings, CHAT_GPT_ADMIN_RULE
from src.database import db_manager
from src.gpt_chat.models import GPTMessage
from src.gpt_chat.schemas import GPTMessageCreate, GPTMessage as GPTMessageSchema
from src.users.service import get_user_by_tg_username

API_URL = settings.proxy_url + "/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {settings.api_token}",
    "Content-Type": "application/json",
}


def serialize_sqlalchemy_model(model):
    dct = {}
    for key, value in model.__dict__.items():
        if key.startswith("_") or key not in ("role", "content"):
            continue
        dct[key] = value
    return dct


async def get_gpt_messages_by_user_id(
    session: AsyncSession,
    user_id: int,
    limit: int = 16,
) -> List[GPTMessage]:
    stmt = select(GPTMessage).where(GPTMessage.user_id == user_id).limit(limit)
    result: Result = await session.execute(stmt)
    messages = result.scalars().all()
    return list(messages)


async def create_gpt_message(
    session: AsyncSession, gpt_message_create: GPTMessageCreate
) -> GPTMessageCreate:
    message = GPTMessage(**gpt_message_create.model_dump())
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message


async def ask_chatgpt(tg_username: str, prompt: str) -> str:
    async with db_manager.session_maker() as session:
        user = await get_user_by_tg_username(
            session=session, tg_username="@" + tg_username
        )
        messages = await get_gpt_messages_by_user_id(session=session, user_id=user.id)
        messages = list(map(lambda x: serialize_sqlalchemy_model(x), messages))
        chat_history = [{"role": "system", "content": CHAT_GPT_ADMIN_RULE}, *messages]

        data = {
            "model": "gpt-4o",
            "messages": [*chat_history, {"role": "user", "content": prompt}],
            "temperature": 0.5,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, headers=headers, json=data)
            response.raise_for_status()  # Выбрасывает ошибку, если запрос не удался
            message = GPTMessageCreate(role="user", content=prompt, user_id=user.id)
            await create_gpt_message(session=session, gpt_message_create=message)
            assistant_message = response.json()["choices"][0]["message"]["content"]
            message = GPTMessageCreate(
                role="assistant", content=assistant_message, user_id=user.id
            )
            await create_gpt_message(session=session, gpt_message_create=message)

            return assistant_message


async def clear_history(session: AsyncSession, tg_username: str):
    user = await get_user_by_tg_username(session=session, tg_username="@" + tg_username)
    stmt = delete(GPTMessage).where(GPTMessage.user_id == user.id)
    await session.execute(stmt)
    await session.commit()


# async def get_all_business_notes(session: AsyncSession) -> List[BusinessNote]:
#     stmt = select(BusinessNote).options(selectinload(BusinessNote.user))
#     result: Result = await session.execute(stmt)
#     business_notes = result.scalars().all()
#     return list(business_notes)


# async def get_gpt_messages_by_id(
#     session: AsyncSession, business_note_id: int
# ) -> BusinessNote:
#     stmt = select(BusinessNote).where(BusinessNote.id == business_note_id)
#     result: Result = await session.execute(stmt)
#     business_note = result.scalars().one_or_none()
#
#     if business_note is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Запись с ID ({business_note_id}) не найдена",
#         )
#     return business_note
