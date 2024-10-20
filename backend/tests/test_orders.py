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


@pytest.mark.asyncio
async def test_delete_order():
    async with aiohttp.ClientSession() as session:
        try:
            order_id = await post_order()
            await patch_order(order_id)
        except AssertionError as e:
            raise e
        finally:
            url = f"http://localhost:8000/api/orders/?order_id={order_id}"
            async with session.delete(url=url, headers=headers) as response:
                assert 200 <= response.status < 400


async def post_order() -> int:
    url = "http://localhost:8000/api/orders/"
    data = {
        "full_name": "test",
        "address": "test",
        "phone_number": "test",
        "email": "test@test.com",
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
            data = await response.json()
            assert isinstance(data["id"], int)
            return data["id"]


async def patch_order(order_id: int):
    url = f"http://localhost:8000/api/orders/?order_id={order_id}"
    data = {"full_name": "test2"}
    async with aiohttp.ClientSession() as session:
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
