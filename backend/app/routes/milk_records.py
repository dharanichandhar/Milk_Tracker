from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import DailyMilkRecord, MilkPrice, Customer, subscription_table
from app.utils.session import validate_session
from app.models import CustomerLoginCrendential
from pydantic import BaseModel

router = APIRouter(prefix="/api/milk-records", tags=["Milk Records"])


class MilkRecordUpdate(BaseModel):
    vendor_id: int
    date: date
    quantity: float


def get_current_customer(request: Request, db: Session):
    token = request.cookies.get("customer_session")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    credential = validate_session(db, CustomerLoginCrendential, token)
    if not credential:
        raise HTTPException(status_code=401, detail="Invalid session")

    customer = db.query(Customer).filter(Customer.id == credential.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


@router.get("")
@router.get("/")
def get_milk_records(
    request: Request,
    vendor_id: int = None,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    query = db.query(DailyMilkRecord).filter(DailyMilkRecord.customer_id == customer.id)

    if vendor_id:
        query = query.filter(DailyMilkRecord.vendor_id == vendor_id)

    if start_date:
        query = query.filter(DailyMilkRecord.date >= start_date)

    if end_date:
        query = query.filter(DailyMilkRecord.date <= end_date)

    records = query.order_by(DailyMilkRecord.date.desc()).all()

    return {
        "records": [
            {
                "id": r.id,
                "vendor_id": r.vendor_id,
                "date": r.date.isoformat(),
                "quantity": float(r.quantity),
                "price_per_liter": float(r.price_per_liter),
                "amount": float(r.amount),
                "is_override": r.is_override,
            }
            for r in records
        ]
    }


@router.post("/update")
def update_milk_record(
    request: Request,
    data: MilkRecordUpdate,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    subscription = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == data.vendor_id,
            subscription_table.c.is_active,
        )
    ).first()

    if not subscription:
        raise HTTPException(status_code=400, detail="Not subscribed to this vendor")

    existing = db.query(DailyMilkRecord).filter(
        DailyMilkRecord.customer_id == customer.id,
        DailyMilkRecord.vendor_id == data.vendor_id,
        DailyMilkRecord.date == data.date,
    ).first()

    current_price = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == data.vendor_id,
        MilkPrice.effective_from <= data.date,
    ).order_by(MilkPrice.effective_from.desc()).first()

    price_per_liter = float(current_price.price_per_liter) if current_price else 60.0
    amount = data.quantity * price_per_liter

    if existing:
        existing.quantity = data.quantity
        existing.price_per_liter = price_per_liter
        existing.amount = amount
        existing.is_override = True
    else:
        record = DailyMilkRecord(
            customer_id=customer.id,
            vendor_id=data.vendor_id,
            date=data.date,
            quantity=data.quantity,
            price_per_liter=price_per_liter,
            amount=amount,
            is_override=True,
        )
        db.add(record)

    db.commit()

    return {"success": True, "message": "Record updated successfully"}
