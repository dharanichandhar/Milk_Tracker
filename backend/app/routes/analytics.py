from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.database import get_db
from app.models import (
    Vendor, Customer, DailyMilkRecord, Payment, PaymentStatus,
    VendorLoginCredential, subscription_table
)
from app.utils.session import validate_session

router = APIRouter(prefix="/api/vendors", tags=["Analytics"])


def get_current_vendor(request: Request, db: Session):
    token = request.cookies.get("vendor_session")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    credential = validate_session(db, VendorLoginCredential, token)
    if not credential:
        raise HTTPException(status_code=401, detail="Invalid session")

    vendor = db.query(Vendor).filter(Vendor.id == credential.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    return vendor


@router.get("/analytics")
def get_analytics(request: Request, db: Session = Depends(get_db)):
    vendor = get_current_vendor(request, db)

    total_customers = db.execute(
        subscription_table.select().where(subscription_table.c.vendor_id == vendor.id)
    ).fetchall()
    total_customers_count = len(total_customers)

    active_subscribers = db.execute(
        subscription_table.select().where(
            subscription_table.c.vendor_id == vendor.id,
            subscription_table.c.is_active,
        )
    ).fetchall()
    active_subscribers_count = len(active_subscribers)

    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).scalar() or 0

    thirty_days_ago = date.today() - timedelta(days=30)
    daily_revenue = db.query(
        DailyMilkRecord.date,
        func.sum(DailyMilkRecord.amount).label("revenue"),
    ).filter(
        DailyMilkRecord.vendor_id == vendor.id,
        DailyMilkRecord.date >= thirty_days_ago,
    ).group_by(DailyMilkRecord.date).order_by(DailyMilkRecord.date).all()

    daily_quantity = db.query(
        DailyMilkRecord.date,
        func.sum(DailyMilkRecord.quantity).label("quantity"),
    ).filter(
        DailyMilkRecord.vendor_id == vendor.id,
        DailyMilkRecord.date >= thirty_days_ago,
    ).group_by(DailyMilkRecord.date).order_by(DailyMilkRecord.date).all()

    total_quantity = db.query(func.sum(DailyMilkRecord.quantity)).filter(
        DailyMilkRecord.vendor_id == vendor.id,
    ).scalar() or 0

    avg_daily_revenue = total_revenue / 30 if total_revenue else 0

    top_customers_query = db.query(
        Customer.id,
        Customer.name,
        func.sum(Payment.amount).label("total_paid")
    ).join(
        Payment, Payment.customer_id == Customer.id
    ).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).group_by(Customer.id, Customer.name).order_by(func.sum(Payment.amount).desc()).limit(5).all()

    top_customers = [
        {
            "id": c.id,
            "name": c.name,
            "total_paid": float(c.total_paid)
        }
        for c in top_customers_query
    ]

    last_month_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
        Payment.paid_at >= thirty_days_ago,
    ).scalar() or 0

    previous_month_start = thirty_days_ago - timedelta(days=30)
    previous_month_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
        Payment.paid_at >= previous_month_start,
        Payment.paid_at < thirty_days_ago,
    ).scalar() or 0

    if previous_month_revenue > 0:
        revenue_trend = round(((last_month_revenue - previous_month_revenue) / previous_month_revenue) * 100, 1)
    else:
        revenue_trend = 100.0 if last_month_revenue > 0 else 0.0

    return {
        "total_customers": total_customers_count,
        "active_subscribers": active_subscribers_count,
        "total_revenue": float(total_revenue),
        "total_quantity": float(total_quantity),
        "avg_daily_revenue": round(float(avg_daily_revenue), 2),
        "daily_revenue": [
            {"date": r.date.isoformat(), "revenue": float(r.revenue)}
            for r in daily_revenue
        ],
        "daily_quantity": [
            {"date": q.date.isoformat(), "quantity": float(q.quantity)}
            for q in daily_quantity
        ],
        "top_customers": top_customers,
        "revenue_trend": revenue_trend,
    }


@router.get("/customers")
def get_vendor_customers(request: Request, db: Session = Depends(get_db)):
    vendor = get_current_vendor(request, db)

    subscriptions = db.execute(
        subscription_table.select().where(subscription_table.c.vendor_id == vendor.id)
    ).fetchall()

    customers = []
    for sub in subscriptions:
        customer = db.query(Customer).filter(Customer.id == sub.customer_id).first()
        if customer:
            total_qty = db.query(func.sum(DailyMilkRecord.quantity)).filter(
                DailyMilkRecord.customer_id == customer.id,
                DailyMilkRecord.vendor_id == vendor.id,
            ).scalar() or 0

            customers.append({
                "id": customer.id,
                "name": customer.name,
                "is_active": sub.is_active,
                "total_quantity": float(total_qty),
            })

    return {"customers": customers}


@router.get("/customers/{customer_id}")
def get_customer_detail(
    customer_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    vendor = get_current_vendor(request, db)

    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    subscription = db.execute(
        subscription_table.select().where(
            subscription_table.c.customer_id == customer_id,
            subscription_table.c.vendor_id == vendor.id,
        )
    ).first()

    if not subscription:
        raise HTTPException(status_code=404, detail="Customer not subscribed")

    records = db.query(DailyMilkRecord).filter(
        DailyMilkRecord.customer_id == customer_id,
        DailyMilkRecord.vendor_id == vendor.id,
    ).order_by(DailyMilkRecord.date.desc()).limit(30).all()

    payments = db.query(Payment).filter(
        Payment.customer_id == customer_id,
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).order_by(Payment.paid_at.desc()).all()

    return {
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "is_active": subscription.is_active,
        },
        "records": [
            {
                "id": r.id,
                "date": r.date.isoformat(),
                "quantity": float(r.quantity),
                "price_per_liter": float(r.price_per_liter),
                "amount": float(r.amount),
                "is_override": r.is_override,
            }
            for r in records
        ],
        "payments": [
            {
                "id": p.id,
                "bill_number": p.bill_number,
                "amount": float(p.amount),
                "payment_method": p.payment_method.value,
                "status": p.status.value,
                "paid_at": p.paid_at.isoformat(),
            }
            for p in payments
        ],
    }
