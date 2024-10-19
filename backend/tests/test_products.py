import aiohttp
import pytest
from tests.utils import headers, check_statuses


@pytest.mark.asyncio
async def test_get_not_archived_products():
    url = "http://localhost:8000/api/products/not-archived/"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_archived_products():
    url = "http://localhost:8000/api/products/archived/"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_all_products():
    url = "http://localhost:8000/api/products/all/"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_products_by_id():
    url = "http://localhost:8000/api/products/all/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url, headers=headers) as response:
            assert response.status == 200
            data = await response.json()

    for product in data:
        product_id = product["id"]

        url = f"http://localhost:8000/api/products/?product_id={product_id}"
        await check_statuses(url)
