import requests
from .utils import get_jwt_token, session

token = get_jwt_token()


def test_get_categories():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        "http://localhost:8000/api/products/categories/", headers=headers
    )

    assert response.status_code == 200
