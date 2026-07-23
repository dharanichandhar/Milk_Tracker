from sqlalchemy import Column, DateTime, Integer, String, Table, ForeignKey, Numeric, Date, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import CITEXT
import enum

from app.database import Base


subscription_table = Table(
    "subscription",
    Base.metadata,
    Column(
        "customer_id",
        Integer,
        ForeignKey("customers.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "vendor_id",
        Integer,
        ForeignKey("vendors.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column("default_quantity", Numeric(10, 2), default=1.0),
    Column("is_active", Boolean, default=True),
    Column("subscribed_at", DateTime(timezone=True)),
)


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=True)

    customers = relationship(
        "Customer",
        secondary=subscription_table,
        back_populates="vendors",
    )
    milk_prices = relationship("MilkPrice", back_populates="vendor")
    daily_records = relationship("DailyMilkRecord", back_populates="vendor")


class VendorLoginCredential(Base):
    __tablename__ = "vendor_login_credentials"

    vendor_id = Column(
        Integer,
        ForeignKey(Vendor.id, ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    email = Column(CITEXT, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    session_token = Column(String, nullable=True)
    session_expires_at = Column(DateTime(timezone=True), nullable=True)


class MilkPrice(Base):
    __tablename__ = "milk_prices"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    price_per_liter = Column(Numeric(10, 2), nullable=False)
    effective_from = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc))

    vendor = relationship("Vendor", back_populates="milk_prices")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    vendors = relationship(
        "Vendor",
        secondary=subscription_table,
        back_populates="customers",
    )
    daily_records = relationship("DailyMilkRecord", back_populates="customer")


class CustomerLoginCrendential(Base):
    __tablename__ = "customer_login_credentials"

    customer_id = Column(
        Integer,
        ForeignKey(Customer.id, ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    email = Column(CITEXT, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    session_token = Column(String, nullable=True)
    session_expires_at = Column(DateTime(timezone=True), nullable=True)


class DailyMilkRecord(Base):
    __tablename__ = "daily_milk_records"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    price_per_liter = Column(Numeric(10, 2), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)  
    is_override = Column(Boolean, default=False)
    billed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc))

    customer = relationship("Customer", back_populates="daily_records")
    vendor = relationship("Vendor", back_populates="daily_records")


class PaymentMethod(str, enum.Enum):
    upi = "UPI"
    card = "Card"
    cash = "Cash"


class PaymentStatus(str, enum.Enum):
    success = "success"
    failed = "failed"
    pending = "pending"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.success)
    bill_number = Column(String, nullable=False)
    paid_at = Column(DateTime(timezone=True), default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc))
    created_at = Column(DateTime(timezone=True), default=lambda: __import__('datetime').datetime.now(__import__('datetime').timezone.utc))
