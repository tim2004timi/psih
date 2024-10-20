import aiohttp
import pytest
from tests.utils import headers, check_statuses


@pytest.mark.asyncio
async def test_get_not_archived_products():
    url = "http://localhost:8000/api/products/?archived=false"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_archived_products():
    url = "http://localhost:8000/api/products/?archived=true"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_all_products():
    url = "http://localhost:8000/api/products/"
    await check_statuses(url)


@pytest.mark.asyncio
async def test_get_products_by_id():
    url = "http://localhost:8000/api/products/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url, headers=headers) as response:
            assert response.status == 200
            data = await response.json()

    for product in data:
        product_id = product["id"]

        url = f"http://localhost:8000/api/products/{product_id}/"
        await check_statuses(url)


@pytest.mark.asyncio
async def test_delete_product():
    try:
        product_id = await post_product()
        await patch_product(product_id)
    except AssertionError as e:
        raise e
    finally:
        url = f"http://localhost:8000/api/products/?product_id={product_id}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url=url, headers=headers) as response:
                assert 200 <= response.status < 400


async def get_category_id() -> int:
    url_cat = "http://localhost:8000/api/products/categories/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url_cat, headers=headers) as response:
            assert response.status == 200
            data = await response.json()
    category_id = data[0]["id"]
    assert isinstance(category_id, int)
    return category_id


async def post_product() -> int:
    category_id = await get_category_id()

    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/api/products/"
        data = {
            "name": "test",
            "min_price": 1,
            "cost_price": 1,
            "price": 1,
            "discount_price": 1,
            "category_id": category_id,
            "sizes": ["S"],
        }
        async with session.post(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
            data = await response.json()
    return data["id"]


async def patch_product(product_id: int):
    async with aiohttp.ClientSession() as session:
        url = f"http://localhost:8000/api/products/?product_id={product_id}"
        data = {
            "name": "test2",
        }
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
