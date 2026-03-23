from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Vendor

app = FastAPI()


class VendorCreate(BaseModel):
    name: str


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/api/vendors/{vendor_id}")
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"id": vendor.id, "name": vendor.name}


@app.post("/api/vendors")
def create_vendor(vendor_data: VendorCreate, db: Session = Depends(get_db)):
    vendor = Vendor(name=vendor_data.name)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return {"id": vendor.id, "name": vendor.name}
