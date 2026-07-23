from datetime import date, timedelta
from app.database import SessionLocal
from app.models import Customer, Vendor, DailyMilkRecord
from sqlalchemy import func


def send_payment_reminders():
    """
    Runs daily at 09:00 AM
    Sends reminders for customers with unbilled milk records older than 7 days
    """
    db = SessionLocal()
    try:
        threshold_date = date.today() - timedelta(days=7)

        unbilled_records = db.query(
            DailyMilkRecord.customer_id,
            DailyMilkRecord.vendor_id,
            func.sum(DailyMilkRecord.amount).label("total_amount")
        ).filter(
            DailyMilkRecord.billed.is_(False),
            DailyMilkRecord.date < threshold_date,
        ).group_by(
            DailyMilkRecord.customer_id,
            DailyMilkRecord.vendor_id
        ).all()

        for record in unbilled_records:
            customer = db.query(Customer).filter(Customer.id == record.customer_id).first()
            vendor = db.query(Vendor).filter(Vendor.id == record.vendor_id).first()

            print(
                f"Reminder: {customer.name} has unbilled amount of "
                f"₹{record.total_amount} from {vendor.name}"
            )

        print(f"Sent reminders for {len(unbilled_records)} pending payments")
    except Exception as e:
        print(f"Error sending payment reminders: {e}")
    finally:
        db.close()
