from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Vendor, Customer

app = FastAPI()

"""
URL Design

Add a new milk vendor - POST /vendors
Retrieve a milk vendor - GET /vendors/{vendor_id}

ER Design - Entity Relationship mapping

Entities
-------- 

Vendor
- id (primary key)
- name

Customer
- id (primary key)
- name

Subscription: Vendor - Customer: Many-Many
"""



class CustomerCreate(BaseModel):
    name: str


class VendorCreate(BaseModel):
    name: str


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/api/vendors/{vendor_id}")
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"id": vendor.id, "name": vendor.name}


@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"id": customer.id, "name": customer.name}


@app.post("/api/vendors")
def create_vendor(vendor_data: VendorCreate, db: Session = Depends(get_db)):
    vendor = Vendor(name=vendor_data.name)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return {"id": vendor.id, "name": vendor.name}


@app.post("/api/customers")
def create_customer(customer_data: CustomerCreate, db: Session = Depends(get_db)):
    customer = Customer(name=customer_data.name)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return {"id": customer.id, "name": customer.name}
