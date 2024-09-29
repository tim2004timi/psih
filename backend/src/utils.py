import os
import uuid
import shutil
from fastapi import UploadFile, File
from .config import UPLOAD_DIR


def get_file_path(*path_segments) -> str:
    path = os.path.join(*path_segments)

    normalized_path = path.replace(os.path.sep, "/")

    return normalized_path


async def upload_file(file: UploadFile, dir_name: str) -> str:
    full_dir_path = get_file_path(UPLOAD_DIR, dir_name)

    if not os.path.exists(full_dir_path):
        os.makedirs(full_dir_path)

    file_extension = os.path.splitext(file.filename)[1]  # Получаем расширение файла
    unique_filename = f"{uuid.uuid4()}{file_extension}"  # Генерируем UUID + расширение

    file_path = get_file_path(full_dir_path, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = file_path
    if file_path[:2] == "./":
        url = file_path[2:]

    return url
