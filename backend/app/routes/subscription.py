from fastapi import APIRouter, Depends, Form, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Customer, CustomerLoginCrendential, Vendor
from fastapi.responses import RedirectResponse
from app.schema.schema import SubscriptionCreate, SubscribeRequest
from app.utils.session import validate_session

router = APIRouter(prefix="/api/subscriptions", tags=["Subscription"])


@router.post("/create")
def create_subscription(
    request: Request, data: SubscribeRequest, db: Session = Depends(get_db)
):
    customer = get_current_customer(request, db)

    vendor = db.query(Vendor).filter(Vendor.id == data.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if vendor in customer.vendors:
        raise HTTPException(status_code=400, detail="Already subscribed")

    customer.vendors.append(vendor)
    db.commit()

    return {"success": True, "message": "Subscribed successfully"}


def get_current_customer(request: Request, db: Session):
    token = request.cookies.get("customer_session")

    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    session_data = validate_session(db, CustomerLoginCrendential, token)

    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    customer = (
        db.query(Customer).filter(Customer.id == session_data.customer_id).first()
    )

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


@router.get("/my-vendors")
def get_my_subscriptions(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    return {
        "customer_id": customer.id,
        "customer_name": customer.name,
        "vendors": [
            {"id": v.id, "name": v.name, "image_url": v.image_url}
            for v in customer.vendors
        ],
    }


@router.get("/subscription-data")
def get_subscription_data(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    all_vendors = db.query(Vendor).all()
    subscribed = customer.vendors

    available = [v for v in all_vendors if v not in subscribed]

    return {
        "subscribed_vendors": [
            {"id": v.id, "name": v.name, "image_url": v.image_url} for v in subscribed
        ],
        "available_vendors": [{"id": v.id, "name": v.name} for v in available],
    }



@router.post("/unsubscribe/{vendor_id}")
def unsubscribe_vendor(vendor_id: int, request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if vendor not in customer.vendors:
        raise HTTPException(status_code=400, detail="Not subscribed")

    # 🔥 REMOVE RELATION
    customer.vendors.remove(vendor)
    db.commit()

    return {"success": True, "message": "Unsubscribed successfully"}


@router.get("/all")
def get_all_subscription(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()

    result = []
    for customer in customers:
        if not customer.vendors:
            continue

        result.append(
            {
                "customer_id": customer.id,
                "customer_name": customer.name,
                "vendors": [
                    {"vendor_id": v.id, "vendor_name": v.name} for v in customer.vendors
                ],
            }
        )
    return result
