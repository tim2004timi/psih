import aiohttp

from tests.utils import check_statuses, headers
import pytest


@pytest.mark.asyncio
async def test_get_categories():
    url = "http://localhost:8000/api/products/categories/"
    await check_statuses(url=url)


@pytest.mark.asyncio
async def test_delete_categories():
    async with aiohttp.ClientSession() as session:
        try:
            product_category_id = await post_categories()
            await patch_categories(product_category_id)
        except AssertionError as e:
            raise e
        finally:
            url = f"http://localhost:8000/api/products/categories/?product_category_id={product_category_id}"
            async with session.delete(url=url, headers=headers) as response:
                assert 200 <= response.status < 400


async def post_categories() -> int:
    async with aiohttp.ClientSession() as session:
        url = "http://localhost:8000/api/products/categories/"
        data = {"name": "test"}
        async with session.post(url=url, headers=headers, json=data) as response:
            assert response.status == 200
            data = await response.json()
            return data["id"]


async def patch_categories(product_category_id: int):
    async with aiohttp.ClientSession() as session:
        url = f"http://localhost:8000/api/products/categories/?product_category_id={product_category_id}"
        data = {"name": "test2"}
        async with session.patch(url=url, headers=headers, json=data) as response:
            assert 200 <= response.status < 400
