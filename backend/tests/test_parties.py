import aiohttp
import pytest
from tests.utils import check_statuses, headers


@pytest.mark.asyncio
async def test_get_parties():
    url = "http://localhost:8000/api/parties/"
    await check_statuses(url=url)


@pytest.mark.asyncio
async def test_get_parties_by_id():
    url = "http://localhost:8000/api/parties/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url, headers=headers) as response:
            assert response.status == 200
            data = await response.json()

    for party in data:
        party_id = party["id"]
        url = f"http://localhost:8000/api/parties/{party_id}/"
        await check_statuses(url=url)


@pytest.mark.asyncio
async def test_delete_party():
    async with aiohttp.ClientSession() as session:
        try:
            party_id = await post_party()
            # await patch_order(order_id)
        except AssertionError as e:
            raise e
        finally:
            url = f"http://localhost:8000/api/parties/?party_id={party_id}"
            async with session.delete(url=url, headers=headers) as response:
                assert 200 <= response.status < 400


async def post_party() -> int:
    url = "http://localhost:8000/api/parties/"
    data = {
        "agent_name": "test",
        "phone_number": "test",
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
            data = await response.json()
            assert isinstance(data["id"], int)
            return data["id"]


async def patch_party(party_id: int):
    url = f"http://localhost:8000/api/orders/?party_id={party_id}"
    data = {"agent_name": "test2"}
    async with aiohttp.ClientSession() as session:
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
