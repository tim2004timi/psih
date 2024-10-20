import os
import uuid
import shutil
from fastapi import UploadFile, File
from .config import UPLOAD_DIR
import bcrypt


def get_file_path(*path_segments) -> str:
    path = os.path.join(*path_segments)

    normalized_path = path.replace(os.path.sep, "/")

    return normalized_path


def human_readable_size(size: int) -> str:
    for unit in ["Б", "КБ", "МБ", "ГБ", "ТБ"]:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} ТБ"


async def upload_file(file: UploadFile, dir_name: str) -> tuple[str, str]:
    full_dir_path = get_file_path(UPLOAD_DIR, dir_name)

    if not os.path.exists(full_dir_path):
        os.makedirs(full_dir_path)

    file_extension = os.path.splitext(file.filename)[1]  # Получаем расширение файла
    unique_filename = f"{uuid.uuid4()}_{file.filename}{file_extension}"  # Генерируем UUID + расширение

    file_path = get_file_path(full_dir_path, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Получаем размер файла
    file_size = os.path.getsize(file_path)

    # Преобразуем размер в человекочитаемый формат
    human_size = human_readable_size(file_size)

    url = file_path
    if file_path[:2] == "./":
        url = file_path[2:]

    return url, human_size


async def delete_file(file_path: str) -> bool:
    file_path = "./" + file_path
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    else:
        return False


def hash_password(
    password: str,
) -> bytes:
    salt = bcrypt.gensalt()
    pwd_bytes: bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt)


def validate_password(
    password: str,
    hashed_password: bytes,
) -> bool:
    return bcrypt.checkpw(
        password=password.encode(),
        hashed_password=hashed_password,
    )
