from redis.asyncio import Redis
from aiogram import Bot

from ..config import settings

# Инициализация Redis клиента
redis_client = Redis(host='localhost', port=6379, db=0, decode_responses=True)

bot = Bot(token=settings.bot_token)
