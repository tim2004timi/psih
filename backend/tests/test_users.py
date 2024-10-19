import requests
from .utils import get_jwt_token

token = get_jwt_token()


def test_get_users():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/users/", headers=headers)

    assert response.status_code in [200, 403]


def test_get_users_me():
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/users/me", headers=headers)

    assert response.status_code == 200
