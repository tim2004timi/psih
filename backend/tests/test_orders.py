import requests
from .utils import get_jwt_token, session

token = get_jwt_token()


def test_get_orders():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/orders/", headers=headers)

    assert response.status_code == 200


def test_get_orders_by_id():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/orders/", headers=headers)

    assert response.status_code == 200

    for order in response.json():
        order_id = order["id"]
        response = requests.get(
            f"http://localhost:8000/api/orders/{order_id}/", headers=headers
        )
