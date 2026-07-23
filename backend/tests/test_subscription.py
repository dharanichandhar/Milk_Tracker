import uuid
import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def unique_email(prefix):
    return f"{prefix}_{uuid.uuid4()}@test.com"



def create_customer(name, email):
    response = client.post(
        "/api/customers/create",
        json={"name": name, "email": email, "password": "123456"}
    )
    assert response.status_code == 200
    return response.json()["customer_id"]


def login_customer(email):
    response = client.post(
        "/api/customers/login",
        json={"email": email, "password": "123456"}
    )
    assert response.status_code == 200
    return response.cookies


def logout_customer(cookies):
    response = client.post(
        "/api/customers/logout",
        cookies=cookies
    )
    return response


def create_vendor(name, email):
    file_path = "test.jpg"

    if not os.path.exists(file_path):
        raise Exception(" test.jpg not found in project root")

    with open(file_path, "rb") as f:
        response = client.post(
            "/api/vendors/create",
            data={"name": name, "email": email, "password": "123456"},
            files={"image": ("test.jpg", f, "image/jpeg")}
        )

    assert response.status_code == 200
    return response.json()["vendor"]["id"]


def login_vendor(email):
    response = client.post(
        "/api/vendors/login",
        json={"email": email, "password": "123456"}
    )
    assert response.status_code == 200
    return response.cookies


def get_vendor_dashboard(cookies):
    return client.get(
        "/api/vendors/dashboard",
        cookies=cookies
    )



def test_customer_signup():
    email = unique_email("cust_signup")

    res = create_customer("Dharani", email)

    assert res is not None


def test_customer_login_logout():
    email = unique_email("cust_login")

    create_customer("Dharani", email)

    cookies = login_customer(email)

    res = logout_customer(cookies)

    assert res.status_code == 200
    assert res.json()["success"] is True


def test_vendor_signup():
    email = unique_email("vendor_signup")

    vendor_id = create_vendor("Shop1", email)

    assert isinstance(vendor_id, int)


def test_vendor_login_dashboard():
    email = unique_email("vendor_login")

    vendor_id = create_vendor("Shop2", email)

    cookies = login_vendor(email)

    res = get_vendor_dashboard(cookies)

    assert res.status_code == 200
    assert res.json()["vendor_id"] == vendor_id


def test_create_subscription():
    vendor_email = unique_email("sub_vendor")
    customer_email = unique_email("sub_customer")

    vendor_id = create_vendor("SubShop", vendor_email)
    customer_id = create_customer("SubUser", customer_email)

    response = client.post(
        "/api/subscriptions/create",
        json={
            "customer_id": customer_id,
            "vendor_id": vendor_id
        }
    )

    assert response.status_code == 200
    assert response.json()["success"] is True


def test_duplicate_subscription():
    vendor_email = unique_email("dup_vendor")
    customer_email = unique_email("dup_customer")

    vendor_id = create_vendor("DupShop", vendor_email)
    customer_id = create_customer("DupUser", customer_email)

    client.post(
        "/api/subscriptions/create",
        json={"customer_id": customer_id, "vendor_id": vendor_id}
    )

    response = client.post(
        "/api/subscriptions/create",
        json={"customer_id": customer_id, "vendor_id": vendor_id}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Already subscribed"


def test_subscription_not_found():
    response = client.post(
        "/api/subscriptions/create",
        json={"customer_id": 99999, "vendor_id": 99999}
    )

    assert response.status_code == 404


def test_get_all_subscriptions():
    vendor_id = create_vendor("ListShop", unique_email("list_vendor"))
    customer_id = create_customer("ListUser", unique_email("list_customer"))

    client.post(
        "/api/subscriptions/create",
        json={"customer_id": customer_id, "vendor_id": vendor_id}
    )

    response = client.get("/api/subscriptions/all")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 0
