import pytest
from tests.utils import check_statuses


@pytest.mark.asyncio
async def test_get_users():
    url = "http://localhost:8000/api/users/"
    await check_statuses(url=url, statuses=(200, 403))


@pytest.mark.asyncio
async def test_get_users_me():
    url = "http://localhost:8000/api/users/me"
    await check_statuses(url=url)
