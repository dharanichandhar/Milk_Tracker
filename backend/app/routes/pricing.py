from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import date
from pydantic import BaseModel
from app.database import get_db
from app.models import Vendor, MilkPrice, VendorLoginCredential
from app.utils.session import validate_session

router = APIRouter(prefix="/api/vendors", tags=["Pricing"])


class PriceUpdate(BaseModel):
    price_per_liter: float


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


@router.get("/{vendor_id}/price")
def get_vendor_price(vendor_id: int, db: Session = Depends(get_db)):
    current_price = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == vendor_id,
        MilkPrice.effective_from <= date.today(),
    ).order_by(MilkPrice.effective_from.desc()).first()

    return {
        "vendor_id": vendor_id,
        "current_price": float(current_price.price_per_liter) if current_price else 60.0,
    }


@router.get("/pricing")
def get_pricing(request: Request, db: Session = Depends(get_db)):
    vendor = get_current_vendor(request, db)

    current_price = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == vendor.id,
        MilkPrice.effective_from <= date.today(),
    ).order_by(MilkPrice.effective_from.desc()).first()

    history = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == vendor.id,
    ).order_by(MilkPrice.effective_from.desc()).limit(10).all()

    return {
        "current_price": float(current_price.price_per_liter) if current_price else 60.0,
        "history": [
            {
                "price_per_liter": float(p.price_per_liter),
                "effective_from": p.effective_from.isoformat(),
            }
            for p in history
        ],
    }


@router.post("/pricing")
def update_pricing(
    request: Request,
    data: PriceUpdate,
    db: Session = Depends(get_db),
):
    vendor = get_current_vendor(request, db)

    if data.price_per_liter <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")

    existing_today = db.query(MilkPrice).filter(
        MilkPrice.vendor_id == vendor.id,
        MilkPrice.effective_from == date.today(),
    ).first()

    if existing_today:
        existing_today.price_per_liter = data.price_per_liter
    else:
        new_price = MilkPrice(
            vendor_id=vendor.id,
            price_per_liter=data.price_per_liter,
            effective_from=date.today(),
        )
        db.add(new_price)

    db.commit()

    return {
        "success": True,
        "message": "Price updated successfully",
        "new_price": data.price_per_liter,
    }
