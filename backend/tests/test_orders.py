import aiohttp
import pytest
from tests.utils import check_statuses, headers


@pytest.mark.asyncio
async def test_get_orders():
    url = "http://localhost:8000/api/orders/"
    await check_statuses(url=url)


@pytest.mark.asyncio
async def test_get_orders_by_id():
    url = "http://localhost:8000/api/orders/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url, headers=headers) as response:
            assert response.status == 200
            data = await response.json()

    for order in data:
        order_id = order["id"]
        url = f"http://localhost:8000/api/orders/{order_id}/"
        await check_statuses(url=url)
