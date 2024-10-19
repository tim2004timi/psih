from .utils import headers, check_statuses
import pytest


@pytest.mark.asyncio
async def test_get_categories():
    url = "http://localhost:8000/api/products/categories/"
    await check_statuses(url=url)
