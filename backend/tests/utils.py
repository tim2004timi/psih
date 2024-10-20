import aiohttp
import requests


def get_jwt_token():
    user_data = {
        "username": "string",
        "password": "string",
    }

    response = requests.post(
        "http://localhost:8000/api/jwt/login/",
        data=user_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    return response.json()["access_token"]


token = get_jwt_token()
headers = {"Authorization": f"Bearer {token}"}


async def check_statuses(url: str, statuses: tuple = (200,)):
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url, headers=headers) as response:
            assert response.status in statuses
