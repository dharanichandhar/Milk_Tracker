from sqlalchemy import Column, DateTime, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import CITEXT

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

class VendorLoginCredential(Base):
    __tablename__ = "vendor_login_credentials"

    vendor_id = Column(
        Integer,
        ForeignKey(Vendor.id, ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )
    email = Column(CITEXT, unique=True, nullable = False)
    password_hash = Column(String, nullable = False)

    session_token = Column(String, nullable = True)
    session_expires_at = Column(DateTime(timezone=True), nullable = True)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    vendors = relationship(
        "Vendor",
        secondary=subscription_table,
        back_populates="customers",
    )


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
