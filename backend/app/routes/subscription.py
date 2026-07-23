from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timezone, date
from app.database import get_db
from app.models import (
    Customer, CustomerLoginCrendential, Vendor, subscription_table,
    DailyMilkRecord, MilkPrice
)
from app.utils.session import validate_session
from pydantic import BaseModel

router = APIRouter(prefix="/api/subscriptions", tags=["Subscription"])


class SubscribeWithQuantity(BaseModel):
    vendor_id: int
    quantity: float = 1.0


class UpdateQuantity(BaseModel):
    default_quantity: float


def get_current_customer(request: Request, db: Session):
    token = request.cookies.get("customer_session")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    session_data = validate_session(db, CustomerLoginCrendential, token)
    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    customer = db.query(Customer).filter(Customer.id == session_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


def create_milk_record_for_today(db: Session, customer_id: int, vendor_id: int, quantity: float):
    today = date.today()

    existing_record = db.query(DailyMilkRecord).filter(
        DailyMilkRecord.customer_id == customer_id,
        DailyMilkRecord.vendor_id == vendor_id,
        DailyMilkRecord.date == today,
    ).first()

    if existing_record:
        return

    current_price = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == vendor_id,
        MilkPrice.effective_from <= today,
    ).order_by(MilkPrice.effective_from.desc()).first()

    price_per_liter = float(current_price.price_per_liter) if current_price else 60.0
    amount = quantity * price_per_liter

    record = DailyMilkRecord(
        customer_id=customer_id,
        vendor_id=vendor_id,
        date=today,
        quantity=quantity,
        price_per_liter=price_per_liter,
        amount=amount,
        is_override=False,
        billed=False,
    )
    db.add(record)


@router.post("/create")
def create_subscription(
    request: Request,
    data: SubscribeWithQuantity,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    vendor = db.query(Vendor).filter(Vendor.id == data.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    existing = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor.id,
        )
    ).first()

    if existing:
        if existing.is_active:
            raise HTTPException(status_code=400, detail="Already subscribed")
        db.execute(
            subscription_table.update().where(
                subscription_table.c.customer_id == customer.id,
                subscription_table.c.vendor_id == vendor.id,
            ).values(
                is_active=True,
                default_quantity=data.quantity,
                subscribed_at=datetime.now(timezone.utc),
            )
        )
        create_milk_record_for_today(db, customer.id, vendor.id, data.quantity)
        db.commit()
        return {"success": True, "message": "Reactivated subscription"}

    db.execute(
        subscription_table.insert().values(
            customer_id=customer.id,
            vendor_id=vendor.id,
            default_quantity=data.quantity,
            is_active=True,
            subscribed_at=datetime.now(timezone.utc),
        )
    )
    create_milk_record_for_today(db, customer.id, vendor.id, data.quantity)
    db.commit()

    return {"success": True, "message": "Subscribed successfully"}


@router.patch("/{vendor_id}")
def update_subscription_quantity(
    vendor_id: int,
    request: Request,
    data: UpdateQuantity,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    existing = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor_id,
        )
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Subscription not found")

    db.execute(
        subscription_table.update().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor_id,
        ).values(default_quantity=data.default_quantity)
    )
    db.commit()

    return {"success": True, "message": "Quantity updated"}


@router.get("/my-vendors")
def get_my_subscriptions(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    subscriptions = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.is_active,
        )
    ).fetchall()

    vendors = []
    for sub in subscriptions:
        vendor = db.query(Vendor).filter(Vendor.id == sub.vendor_id).first()
        if vendor:
            vendors.append({
                "id": vendor.id,
                "name": vendor.name,
                "image_url": vendor.image_url,
                "default_quantity": float(sub.default_quantity) if sub.default_quantity else 1.0,
            })

    return {
        "customer_id": customer.id,
        "customer_name": customer.name,
        "vendors": vendors,
    }


@router.get("/subscription-data")
def get_subscription_data(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    subscribed_ids = set()
    subscribed_vendors = []

    subscriptions = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.is_active,
        )
    ).fetchall()

    for sub in subscriptions:
        vendor = db.query(Vendor).filter(Vendor.id == sub.vendor_id).first()
        if vendor:
            subscribed_ids.add(vendor.id)
            subscribed_vendors.append({
                "id": vendor.id,
                "name": vendor.name,
                "image_url": vendor.image_url,
                "default_quantity": float(sub.default_quantity) if sub.default_quantity else 1.0,
            })

    all_vendors = db.query(Vendor).all()
    available_vendors = [v for v in all_vendors if v.id not in subscribed_ids]

    return {
        "subscribed_vendors": subscribed_vendors,
        "available_vendors": [
            {"id": v.id, "name": v.name, "image_url": v.image_url}
            for v in available_vendors
        ],
    }


@router.post("/unsubscribe/{vendor_id}")
def unsubscribe_vendor(
    vendor_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    existing = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor_id,
        )
    ).first()

    if not existing:
        raise HTTPException(status_code=400, detail="Not subscribed")

    db.execute(
        subscription_table.update().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor_id,
        ).values(is_active=False)
    )
    db.commit()

    return {"success": True, "message": "Unsubscribed successfully"}


@router.get("/all")
def get_all_subscription(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()

    result = []
    for customer in customers:
        subscriptions = db.execute(
            subscription_table.select().where(
                subscription_table.c.customer_id == customer.id,
                subscription_table.c.is_active,
            )
        ).fetchall()

        if not subscriptions:
            continue

        vendors = []
        for sub in subscriptions:
            vendor = db.query(Vendor).filter(Vendor.id == sub.vendor_id).first()
            if vendor:
                vendors.append({
                    "vendor_id": vendor.id,
                    "vendor_name": vendor.name,
                })

        result.append({
            "customer_id": customer.id,
            "customer_name": customer.name,
            "vendors": vendors,
        })

    return result
