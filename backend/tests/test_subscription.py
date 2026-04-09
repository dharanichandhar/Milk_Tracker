from fastapi.testclient import TestClient
from app.main import app


def create_vendor(client, name="Test_Vendor"):
    response = client.post("/api/vendors/create", data={"name": name})
    return response.json()["id"]

def create_customer(client, name="Test_customer"):
    response = client.post("/api/customers/create" , data ={"name": name})
    return response.json()["id"]


def test_get_particular_vendor():
    with TestClient(app) as client:
        
        vendor_id = create_vendor(client , "mani")

        response = client.get(f"/api/vendors/particular_vendor?vendor_id={vendor_id}")

        assert response.status_code == 200
        data = response.json()

        assert data["id"] == vendor_id
        assert data["name"] == "mani"
        

def test_get_particular_customer():
    with TestClient(app) as client:

        customer_id = create_customer(client , "vijay")

        response = client.get(f"/api/customers/particular?customer_id={customer_id}")

        assert response.status_code == 200
        data = response.json()

        assert data["id"] == customer_id
        assert data["name"] == "vijay"



def test_all_vendors():
    with TestClient(app) as client:
        create_vendor(client, "dharani")
        create_vendor(client, "chandhar")
        create_vendor(client, "sangar")

        response = client.get("/api/vendors")
        assert response.status_code == 200
        data = response.json()

        names = [V["name"] for V in data]
        assert all(name in names for name in ["dharani", "chandhar", "sangar"])


def test_all_custome():
    with TestClient(app) as client:
        create_customer(client, "lena")
        create_customer(client, "stephen")
        create_customer(client, "Aakash")

        response = client.get("/api/customers")
        assert response.status_code == 200
        data = response.json()

        names = [C["name"] for C in data]
        assert all(name in names for name in ["lena", "stephen", "Aakash"])


def test_create_customer():
    with TestClient(app) as client:
        response = client.post("/api/customers/create" , data={"name" : "Devan"})
        assert response.status_code == 200

        data =  response.json()

        assert "id" in data
        assert data["name"] == "Devan"


def test_create_vendor():
    with TestClient(app) as client:
        response = client.post("/api/vendors/create" , data ={"name" : "Raj"})
        assert response.status_code == 200

        data = response.json()

        assert "id" in data
        assert data["name"] == "Raj"





# def create_vendor(client, name="Test_Vendor"):
#     response = client.post("/api/vendors", json={"name": name})
#     return response.json()["id"]


# def create_customer(client, name="Test_Customer"):
#     response = client.post("/api/customers", json={"name": name})
#     return response.json()["id"]


# def test_add_subscription():
#     with TestClient(app) as client:
#         vendor_id = create_vendor(client, "Anand")
#         customer_id = create_customer(client, "Anjali")

#         client.post(f"/api/customers/{customer_id}/subscription",json={"vendor_id": vendor_id})

#         response = client.get(f"/api/customers/{customer_id}")
#         data = response.json()

#         assert data["name"] == "Anjali"
#         assert len(data["vendors"]) == 1
#         assert data["vendors"][0]["name"] == "Anand"


# def test_remove_subscription():
#     with TestClient(app) as client:
#         vendor_id = create_vendor(client)
#         customer_id = create_customer(client)

#         client.post(f"/api/customers/{customer_id}/subscription",json={"vendor_id": vendor_id})
#         assert response.status_code == 200

#         client.delete(f"/api/customers/{customer_id}/subscription/{vendor_id}")

#         response = client.get(f"/api/customers/{customer_id}")
#         data = response.json()

#         assert len(data["vendors"]) == 0


# def test_remove_subscription_not_subscribed():
#     with TestClient(app) as client:
#         vendor_id = create_vendor(client)
#         customer_id = create_customer(client)

#         response = client.delete(f"/api/customers/{customer_id}/subscription/{vendor_id}")

#         assert response.status_code == 400
#         assert response.json()["detail"] == "Customer does not have subscription with this Vendor"




# def test_all_vendors():
#     with TestClient(app) as client:
#         create_vendor(client, "dharani")
#         create_vendor(client, "chandhar")
#         create_vendor(client, "sangar")

#         response = client.get("/api/vendors")
#         assert response.status_code == 200
#         data = response.json()

#         names = []
#         for vendor in data:
#             names.append(vendor["name"])

#         assert "dharani" in names
#         assert "chandhar" in names
#         assert "sangar" in names
        

#         for vendor in data:
#             assert "id" in vendor 
#             assert "name" in vendor 


# def test_all_customers():
#     with TestClient(app) as client:
#         create_customer(client, "Lena")
#         create_customer(client, "praveen")
#         create_customer(client, "Bala")

#         response = client.get("/api/customers")
#         data = response.json()
#         response.status_code == 200
        

#         names = []
#         for customer in data:
#             names.append(customer["name"])

       
#         assert "Lena" in names
#         assert "praveen" in names
#         assert "Bala" in names
       

#         for customer in data:
#             assert "id" in customer 
#             assert "name" in customer 
