from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Customer, Vendor
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/api/subscriptions", tags=["Subscription"])


@router.post("/create")
def create_subscription(
    customer_id: int = Form(...),
    vendor_id: int = Form(...),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()

    if not customer:
        return RedirectResponse(
            url=f"/subscription?customer_id={customer_id}&error=1", status_code=404
        )

    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        return RedirectResponse(
            url=f"/subscription?customer_id={customer_id}&error=1", status_code=404
        )

    if vendor in customer.vendors:
        return RedirectResponse(
            url=f"/subscription?customer_id={customer_id}&error=2", status_code=404
        )

    customer.vendors.append(vendor)
    db.commit()

    return RedirectResponse(
        url=f"/subscription?customer_id={customer_id}&success=1", status_code=303
    )


# @router.post("/create")
# def create_subscription(
#      customer_id: int = Form(...),
#      vendor_id : int = Form(...),
#      db:Session = Depends(get_db)
# ):

#     customer = db.query(Customer).filter(Customer.id == customer_id).first()
#     if not customer:
#         raise HTTPException(status_code=404 , detail = "Customer not found")

#     vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
#     if not vendor:
#         raise HTTPException(status_code =404 , detail="Vendor not found")

#     if vendor in customer.vendors:
#         raise HTTPException(status_code=400 , detail="Already subscribed")

#     customer.vendors.append(vendor)
#     db.commit()

#     return {
#         "message" : "Subscription create successfully",
#         "customer_id" : customer_id,
#         "vendor_id" : vendor_id
#     }


# @router.get("/all")
# def get_all_subscription(db: Session = Depends(get_db)):
#     customers = db.query(Customer).all()

#     result = []
#     for customer in customers:
#         if not customer.vendors:
#             continue

#         result.append({
#             "customer_id" : customer.id,
#             "customer_name": customer.name,
#             "vendors" : [
#                 {"vendor_id" : v.id, "vendor_name" : v.name}
#                 for v in customer.vendors
#             ]
#         })
#     return result
