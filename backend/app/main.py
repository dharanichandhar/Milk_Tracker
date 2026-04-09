from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models import Vendor, Customer
from app.routes import customer, vendor, subscription

app = FastAPI()

os.makedirs("app/uploads", exist_ok=True)
os.makedirs("app/static", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")
app.mount("/static", StaticFiles(directory="app/static"), name="static")


templates = Jinja2Templates(directory=os.path.join(os.getcwd(), "templates"))


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(request, "index.html", {"request": request})


app.include_router(customer.router)
app.include_router(vendor.router)
app.include_router(subscription.router)


@app.get("/admin")
def admin_home(
    request: Request,
    show: int = 0,
    success: int = 0,
    db: Session = Depends(get_db),
):
    vendors = db.query(Vendor).all()

    return templates.TemplateResponse(
        request,
        "admin.html",
        {
            "request": request,
            "vendors": vendors,
            "show": show,
            "success": success,
        },
    )


@app.get("/customer")
def customer_home(request: Request, db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()

    return templates.TemplateResponse(request, "customer.html", {"vendors": vendors})


@app.get("/vendor")
def vendor_home(request: Request, db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    return templates.TemplateResponse(
        request, "vendor_list.html", {"request": request, "vendors": vendors}
    )


@app.get("/vendor/detail")
def vendor_detail(request: Request, vid: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vid).first()
    if not vendor:
        return templates.TemplateResponse(
            request,
            "vendor_list.html",
            {
                "request": request,
                "vendors": db.query(Vendor).all(),
                "error": "Vendor not found",
            },
        )
    subscribers = vendor.customers
    subscriber_count = len(subscribers)
    return templates.TemplateResponse(
        request,
        "vendor_detail.html",
        {
            "request": request,
            "vendor": vendor,
            "subscribers": subscribers,
            "subscriber_count": subscriber_count,
        },
    )


@app.get("/signup")
def signup_page(request: Request):
    return templates.TemplateResponse(request, "signup.html", {"request": request})


@app.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(request, "login.html", {"request": request})


@app.get("/subscription")
def subscription_page(request: Request):
    return templates.TemplateResponse( request, "subscription.html",{"request": request})

#jsx

@app.get("/api/subscription-data")
def get_subscription_data(customer_id: int, db: Session = Depends(get_db)):
    all_vendors = db.query(Vendor).all()

    subscribed_vendors = []
    available_vendors = all_vendors

    if customer_id:
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if customer:
            subscribed_vendors = customer.vendors
            available_vendors = [] 
            for v in all_vendors:
                if v not in subscribed_vendors:
                    available_vendors.append(v)

    return {
        "subscribed_vendors": [
            {"id": v.id, "name": v.name, "image_url": v.image_url}
            for v in subscribed_vendors
        ],
        "available_vendors": [
            {"id": v.id, "name": v.name}
            for v in available_vendors
        ],
    }


# @app.get("/api/vendors/{vendor_id}")
# def get_vendor(vendor_id: int , db: Session = Depends(get_db)):
#     vendor = db.query(Vendor)/filter(Vendor.id == vendor_id).first()
#     if vendor is None:
#         raise HTTPException(status_code=404, details = "vendor not found")
#     return {"id": vendor.id, "name": vendor.name, "customers": vendor.customers}


# @app.get("/api/customers/{customer_id}")
# def get_customer(customer_id: int, db: Session = Depends(get_db)):
#     customer = db.query(Customer).filter(Customer.id == customer_id).first()
#     if customer is None:
#         raise HTTPException(status_code=404, detail="Customer not found")
#     return {"id": customer.id, "name": customer.name, "vendors": customer.vendors}


# @app.post("/api/vendors")
# def create_vendor(vendor_data: VendorCreate, db: Session = Depends(get_db)):
#     vendor =Vendor(name=vendor_data.name)
#     db.add(vendor)
#     db.commit()
#     db.refresh(vendor)
#     return vendor


# @app.post("/api/customers")
# def create_customer(customer_data: CustomerCreate, db: Session = Depends(get_db)):
#     customer = Customer(name=customer_data.name)
#     db.add(customer)
#     db.commit()
#     db.refresh(customer)
#     return customer


# @app.post("/api/customers/{customer_id}/subscription")
# def create_subscription(customer_id: int, vendor_data: CustomerSubscription, db: Session = Depends(get_db)):
#     customer = db.query(Customer).filter(Customer.id == customer_id).first()
#     if customer is None:
#         raise HTTPException(status_code=404, detail="Customer not found")
#     vendor = db.query(Vendor).filter(Vendor.id == vendor_data.vendor_id).first()
#     if vendor is None:
#         raise HTTPException(status_code=404, detail="Vendor not found")
#     if vendor in customer.vendors:
#         raise HTTPException(status_code=400, detail="Customer already has subscription with this Vendor")
#     customer.vendors.append(vendor)
#     db.commit()
#     db.refresh(customer)
#     return {"id": customer.id, "name": customer.name, "vendors": customer.vendors}


# @app.delete("/api/customers/{customer_id}/subscription/{vendor_id}")
# def delete_subscription(customer_id: int, vendor_id: int, db: Session = Depends(get_db)):
#     customer = db.query(Customer).filter(Customer.id == customer_id).first()
#     if customer is None:
#         raise HTTPException(status_code=404, detail="Customer not found")
#     vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
#     if vendor is None:
#         raise HTTPException(status_code=404, detail="Vendor not found")
#     if vendor not in customer.vendors:
#         raise HTTPException(status_code=400, detail="Customer does not have subscription with this Vendor")
#     customer.vendors.remove(vendor)
#     db.commit()
#     db.refresh(customer)
#     return {"id": customer.id, "name": customer.name, "vendors": customer.vendors}


# # work

# @app.get("/api/customers")
# def get_all_customers(db: Session = Depends(get_db)):
#     customers = db.query(Customer).all()

#     return [
#         {"id": c.id, "name": c.name}
#         for c in customers
#     ]


# @app.get("/api/vendors")
# def get_all_vendors(db: Session = Depends(get_db)):
#     vendors = db.query(Vendor).all()

#     return [
#         {"id": v.id, "name" : v.name }
#         for v in vendors
#     ]

# @app.delete("/api/vendors/{vendor_id}")
# def delete_vendor(vendor_id : int ,  db:Session = Depends(get_db)):
#     vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
#     if vendor is None:
#         raise HTTPException(status_code=404, detail = "The vendor is not found")
#     db.delete(vendor)
#     db.commit()
#     return {"message" : "Vendor deleted successfully"}

# @app.delete("/api/customers/{customer_id}")
# def delete_customer(customer_id : int , db: Session  = Depends(get_db)):
#     customer = db.query(Customer).filter(Customer.id == customer_id).first()
#     if customer is None:
#         raise HTTPException(status_code=404 , detail = "The customer is not found")
#     db.delete(customer)
#     db.commit()
#     return {"message" : "Customer deleted successfully"}
