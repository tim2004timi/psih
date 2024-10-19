import requests
from .utils import get_jwt_token, session

token = get_jwt_token()


def test_get_not_archived_products():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        "http://localhost:8000/api/products/not-archived/", headers=headers
    )

    assert response.status_code == 200


def test_get_archived_products():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        "http://localhost:8000/api/products/archived/", headers=headers
    )

    assert response.status_code == 200


def test_get_all_products():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/products/all/", headers=headers)

    assert response.status_code == 200


def test_get_products_by_id():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/products/all/", headers=headers)

    assert response.status_code == 200

    data = response.json()
    for product in data:
        product_id = product["id"]
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"http://localhost:8000/api/products/?product_id={product_id}",
            headers=headers,
        )
        try:
            assert response.status_code == 200
        except AssertionError:
            print(f"Ошибка при проверке продукта с ID: {product_id}")
            raise
