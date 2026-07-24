from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from passlib.context import CryptContext
from datetime import datetime, timezone
from pydantic import BaseModel
import uuid
from app.schema.schema import CustomerSingup, CustomerLogin
from app.database import get_db
from app.models import (
    Customer, CustomerLoginCrendential, DailyMilkRecord,
    subscription_table, Vendor, Payment, PaymentMethod,
    PaymentStatus
)
from app.utils.session import create_session, invalidate_session, validate_session


router = APIRouter(prefix="/api/customers", tags=["Customers"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class ProfileUpdate(BaseModel):
    name: str



class ConfirmPayment(BaseModel):
    vendor_id: int
    payment_method: PaymentMethod


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/create")
def create_customer(data: CustomerSingup, db: Session = Depends(get_db)):
    customer = Customer(name=data.name)
    db.add(customer)
    db.flush()

    password_hash = get_password_hash(data.password)

    customer_login_credential = CustomerLoginCrendential(
        customer_id=customer.id, email=data.email, password_hash=password_hash
    )

    db.add(customer_login_credential)

    try:
        db.commit()
        db.refresh(customer_login_credential)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")

    token = create_session(db, CustomerLoginCrendential, "customer_id", customer.id)

    response = JSONResponse(
        content={
            "success": True,
            "message": "Signup successfully",
            "customer_id": customer.id,
        }
    )

    response.set_cookie(
        key="customer_session",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=86400,
    )

    return response


@router.post("/login")
def customer_login(data: CustomerLogin, db: Session = Depends(get_db)):
    credential = (
        db.query(CustomerLoginCrendential)
        .filter(CustomerLoginCrendential.email == data.email)
        .first()
    )

    if not credential or not verify_password(data.password, credential.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_session(
        db, CustomerLoginCrendential, "customer_id", credential.customer_id
    )

    response = JSONResponse(content={"success": True, "message": "Login Successfully"})

    response.set_cookie(
        key="customer_session",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=86400,
    )

    return response


@router.post("/logout")
def logout_customer(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("customer_session")
    credential = validate_session(db, CustomerLoginCrendential, token)

    if credential:
        invalidate_session(
            db, CustomerLoginCrendential, "customer_id", credential.customer_id
        )

    response = JSONResponse(content={"success": True, "message": "Logout successfully"})
    response.delete_cookie(
        key="customer_session",
        httponly=True,
        samesite="none",
        secure=True,
        path="/",
    )
    return response


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


@router.get("/me")
def get_customer_me(request: Request, db: Session = Depends(get_db)):
    try:
        customer = get_current_customer(request, db)
        credential = (
            db.query(CustomerLoginCrendential)
            .filter(CustomerLoginCrendential.customer_id == customer.id)
            .first()
        )
        return {
            "logged_in": True,
            "customer_id": customer.id,
            "name": customer.name,
            "email": credential.email if credential else ""
        }
    except HTTPException:
        return {"logged_in": False}


@router.get("/dashboard-stats")
def get_dashboard_stats(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    subscriptions = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.is_active,
        )
    ).fetchall()
    active_subscriptions = len(subscriptions)

    total_amount = db.query(func.sum(DailyMilkRecord.amount)).filter(
        DailyMilkRecord.customer_id == customer.id,
        DailyMilkRecord.billed.is_(False),
    ).scalar() or 0

    recent_records = (
        db.query(DailyMilkRecord)
        .filter(DailyMilkRecord.customer_id == customer.id)
        .order_by(DailyMilkRecord.date.desc())
        .limit(5)
        .all()
    )

    records_with_vendor = []
    for r in recent_records:
        vendor = db.query(Vendor).filter(Vendor.id == r.vendor_id).first()
        records_with_vendor.append({
            "id": r.id,
            "vendor_name": vendor.name if vendor else "Unknown",
            "date": r.date.isoformat(),
            "quantity": float(r.quantity),
            "amount": float(r.amount),
        })

    return {
        "active_subscriptions": active_subscriptions,
        "total_amount": float(total_amount),
        "recent_records": records_with_vendor,
    }


@router.get("/profile")
def get_customer_profile(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    credential = (
        db.query(CustomerLoginCrendential)
        .filter(CustomerLoginCrendential.customer_id == customer.id)
        .first()
    )

    return {
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "email": credential.email if credential else "",
        }
    }


@router.patch("/profile")
def update_customer_profile(
    request: Request,
    data: ProfileUpdate,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)
    customer.name = data.name
    db.commit()
    db.refresh(customer)

    return {"success": True, "message": "Profile updated successfully"}


@router.get("/payable-amounts")
def get_payable_amounts(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    subscriptions = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.is_active,
        )
    ).fetchall()

    payables = []
    grand_total = 0

    for sub in subscriptions:
        vendor = db.query(Vendor).filter(Vendor.id == sub.vendor_id).first()
        if not vendor:
            continue

        records = db.query(DailyMilkRecord).filter(
            DailyMilkRecord.customer_id == customer.id,
            DailyMilkRecord.vendor_id == vendor.id,
            DailyMilkRecord.billed.is_(False),
        ).all()

        if not records:
            continue

        total_quantity = sum(float(r.quantity) for r in records)
        total_amount = sum(float(r.amount) for r in records)
        record_count = len(records)

        last_payment = db.query(Payment).filter(
            Payment.customer_id == customer.id,
            Payment.vendor_id == vendor.id,
            Payment.status == PaymentStatus.success,
        ).order_by(Payment.paid_at.desc()).first()

        last_payment_date = last_payment.paid_at.isoformat() if last_payment else None

        payables.append({
            "vendor_id": vendor.id,
            "vendor_name": vendor.name,
            "total_quantity": total_quantity,
            "total_amount": total_amount,
            "record_count": record_count,
            "last_payment_date": last_payment_date,
        })
        grand_total += total_amount

    return {
        "payables": payables,
        "grand_total": grand_total,
    }


@router.post("/confirm-payment")
def confirm_payment(
    request: Request,
    data: ConfirmPayment,
    db: Session = Depends(get_db),
):
    customer = get_current_customer(request, db)

    vendor = db.query(Vendor).filter(Vendor.id == data.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    subscription = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer.id,
            subscription_table.c.vendor_id == vendor.id,
            subscription_table.c.is_active,
        )
    ).first()

    if not subscription:
        raise HTTPException(status_code=400, detail="Not subscribed to this vendor")

    records = db.query(DailyMilkRecord).filter(
        DailyMilkRecord.customer_id == customer.id,
        DailyMilkRecord.vendor_id == vendor.id,
        DailyMilkRecord.billed.is_(False),
    ).all()

    if not records:
        raise HTTPException(status_code=400, detail="No pending records to pay")

    total_amount = sum(float(r.amount) for r in records)

    bill_number = f"PAY-{uuid.uuid4().hex[:8].upper()}"

    for r in records:
        r.billed = True

    payment = Payment(
        customer_id=customer.id,
        vendor_id=vendor.id,
        amount=total_amount,
        payment_method=data.payment_method,
        status=PaymentStatus.success,
        bill_number=bill_number,
        paid_at=datetime.now(timezone.utc),
    )
    db.add(payment)

    db.commit()

    return {
        "success": True,
        "payment": {
            "id": payment.id,
            "bill_number": bill_number,
            "vendor_name": vendor.name,
            "amount": total_amount,
            "payment_method": data.payment_method.value,
            "paid_at": payment.paid_at.isoformat(),
        },
    }


@router.get("/payment-history")
def get_payment_history(request: Request, db: Session = Depends(get_db)):
    customer = get_current_customer(request, db)

    payments = db.query(Payment).filter(
        Payment.customer_id == customer.id,
        Payment.status == PaymentStatus.success,
    ).order_by(Payment.paid_at.desc()).all()

    history = []
    for p in payments:
        vendor = db.query(Vendor).filter(Vendor.id == p.vendor_id).first()
        history.append({
            "id": p.id,
            "vendor_name": vendor.name if vendor else "Unknown",
            "amount": float(p.amount),
            "payment_method": p.payment_method.value,
            "bill_number": p.bill_number,
            "paid_at": p.paid_at.isoformat(),
            "status": p.status.value,
        })

    return {"payments": history}
