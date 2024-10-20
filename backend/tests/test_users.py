import aiohttp
import pytest
from tests.utils import check_statuses, headers


@pytest.mark.asyncio
async def test_get_users():
    url = "http://localhost:8000/api/users/"
    await check_statuses(url=url, statuses=(200, 403))


@pytest.mark.asyncio
async def test_get_users_me():
    url = "http://localhost:8000/api/users/me"
    await check_statuses(url=url)


@pytest.mark.asyncio
async def test_delete_user():
    async with aiohttp.ClientSession() as session:
        try:
            user_id = await post_user()
            await patch_user(user_id)
        except AssertionError as e:
            raise e
        finally:
            url = f"http://localhost:8000/api/users/?user_id={user_id}"
            async with session.delete(url=url, headers=headers) as response:
                assert 200 <= response.status < 400


async def post_user() -> int:
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/api/users/"
        data = {
            "username": "test",
            "tg_username": "@test",
            "password": "test",
        }
        async with session.post(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
            data = await response.json()
            assert isinstance(data["id"], int)
            return data["id"]


async def patch_user(user_id: int):
    async with aiohttp.ClientSession() as session:
        url = f"http://localhost:8000/api/users/?user_id={user_id}"
        data = {
            "password": "test",
            "active": False,
        }
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400


@pytest.mark.asyncio
async def test_patch_users_me():
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/api/users/me/"
        data = {
            "password": "string",
        }
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
