from datetime import date
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import DailyMilkRecord, MilkPrice, subscription_table


def generate_daily_milk_records():
    """
    Runs daily at 00:05 AM
    Creates milk records for all active subscriptions
    """
    db: Session = SessionLocal()
    try:
        today = date.today()

        active_subscriptions = db.execute(
            subscription_table.select().where(subscription_table.c.is_active)
        ).fetchall()

        for sub in active_subscriptions:
            customer_id = sub.customer_id
            vendor_id = sub.vendor_id
            default_quantity = sub.default_quantity or 1.0

            existing = db.query(DailyMilkRecord).filter(
                DailyMilkRecord.customer_id == customer_id,
                DailyMilkRecord.vendor_id == vendor_id,
                DailyMilkRecord.date == today,
            ).first()

            if existing:
                continue

            current_price = db.query(MilkPrice).filter(
                MilkPrice.vendor_id == vendor_id,
                MilkPrice.effective_from <= today,
            ).order_by(MilkPrice.effective_from.desc()).first()

            price_per_liter = current_price.price_per_liter if current_price else 60.0
            amount = float(default_quantity) * float(price_per_liter)

            record = DailyMilkRecord(
                customer_id=customer_id,
                vendor_id=vendor_id,
                date=today,
                quantity=default_quantity,
                price_per_liter=price_per_liter,
                amount=amount,
                is_override=False,
            )
            db.add(record)

        db.commit()
        print(f"Generated daily milk records for {today}")
    except Exception as e:
        db.rollback()
        print(f"Error generating daily milk records: {e}")
    finally:
        db.close()
