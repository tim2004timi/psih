import os

from fastapi import FastAPI, Request, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from .orders.router import router as orders_router
from .products.router import products_router, categories_router
from .auth.router import router as auth_router
from .users.router import router as users_router
from .parties.router import router as parties_router
from .collections.router import router as collections_router
from .business_notes.router import router as business_notes_router
from .gpt_chat.models import GPTMessage
from .channel_auto_reply.models import ChannelAutoReply

from .database import Base
from .config import UPLOAD_DIR, DEV


if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

origins = ["http://psihsystem.com"]
if DEV:
    origins.extend(["http://localhost:5173", "http://localhost:4173"])


app = FastAPI(title="Psih Clothes")
main_router = APIRouter(prefix="/api")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.middleware("http")
async def add_csp_header(request, call_next):
    response = await call_next(request)
    if not DEV:
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' "
            "https://cdn.jsdelivr.net; object-src 'none'; img-src 'self' https://fastapi.tiangolo.com;"
        )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if not DEV:
        return
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "details": str(exc)},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)

main_router.include_router(auth_router)
main_router.include_router(categories_router)
main_router.include_router(products_router)
main_router.include_router(orders_router)
main_router.include_router(users_router)
main_router.include_router(parties_router)
main_router.include_router(collections_router)
main_router.include_router(business_notes_router)

app.include_router(main_router)
