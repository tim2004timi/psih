import pytest
import requests
from src.main import app
from sqlalchemy.orm import Session
from src.database import db_manager


def get_jwt_token():
    user_data = {
        "username": "string1",
        "password": "string",
    }

    response = requests.post(
        "http://localhost:8000/api/jwt/login/",
        data=user_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    token = response.json()["access_token"]
    return token


# Фикстура для создания синхронной сессии базы данных
@pytest.fixture
def session():
    with Session(bind=db_manager.engine) as session:
        yield session
        session.close()
