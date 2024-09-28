import json
import os

from fastapi import FastAPI, Request, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from .orders.router import router as orders_router
from .products.router import products_router, categories_router

from .database import Base
from .config import UPLOAD_DIR


# class LogPostPatchRequestsMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         if request.method in ["POST", "PATCH"]:
#             # Клонирование запроса для безопасного доступа к телу
#             body = await request.body()
#             request.state.body = body  # Сохраняем тело в состоянии запроса для последующего использования

#             # Логирование заголовков и тела
#             headers = dict(request.headers)
#             body_text = body.decode(
#                 "utf-8"
#             )  # Декодируем тело запроса из байтов в строку
#             (
#                 print("POST Request:")
#                 if request.method == "POST"
#                 else print("PATCH Request:")
#             )
#             print("Headers:", json.dumps(headers, indent=4))
#             try:
#                 # Попытка интерпретировать тело как JSON и вывод его
#                 body_json = json.loads(body_text)
#                 print("Body:", json.dumps(body_json, indent=4))
#             except json.JSONDecodeError:
#                 # Если тело не является JSON, выводим как есть
#                 print("Body:", body_text)

#             # Создание нового запроса с клонированным телом для дальнейшей обработки
#             request = request.__class__(
#                 scope=request.scope,
#                 receive=lambda b=body: iter(
#                     [b]
#                 ),  # Лямбда функция для имитации асинхронного получения данных
#             )
#         response = await call_next(request)
#         return response


app = FastAPI(title="Psih Clothes")
main_router = APIRouter(prefix="/api")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Маршрут для отдачи статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)

# app.add_middleware(LogPostPatchRequestsMiddleware)


@main_router.get(
    path="/hello-alya/", description="Аля, нажми сюда!", name="Аля, нажми сюда!"
)
async def hi_alya():
    return "Привет, Аля!"


main_router.include_router(categories_router)
main_router.include_router(products_router)
main_router.include_router(orders_router)

app.include_router(main_router)
