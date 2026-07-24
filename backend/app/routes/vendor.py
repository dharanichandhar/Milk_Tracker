from fastapi import (APIRouter,HTTPException,Request,UploadFile,Depends,Form,File,)
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import date
from app.database import get_db
from app.models import (
    Vendor, VendorLoginCredential, Customer, Payment, PaymentStatus,
    DailyMilkRecord, subscription_table
)
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from app.schema.schema import VendorLogin
from sqlalchemy.exc import IntegrityError
from app.cloudinary.cloudinary_service import upload_to_cloudinary
from app.utils.session import create_session, validate_session, invalidate_session


router = APIRouter(prefix="/api/vendors", tags=["vendors"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


class ProfileUpdate(BaseModel):
    name: str


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/create")
def create_vendor(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    email = email.lower()

    ext = image.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png", "webp", "gif"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    image_url = upload_to_cloudinary(image)

    vendor = Vendor(name=name, image_url=image_url)
    db.add(vendor)
    db.flush()

    password_hash = get_password_hash(password)

    vendor_login = VendorLoginCredential(
        vendor_id=vendor.id, email=email, password_hash=password_hash, session_token=""
    )

    db.add(vendor_login)

    try:
        db.commit()
        db.refresh(vendor_login)
    except IntegrityError as e:
        db.rollback()
        print("DB ERROR:", e)
        raise HTTPException(status_code=409, detail="Email already exists or DB issue")

    token = create_session(db, VendorLoginCredential, "vendor_id", vendor.id)

    response = JSONResponse(
        content={
            "success": True,
            "message": "Vendor created successfully",
            "vendor": {"id": vendor.id, "name": vendor.name, "image_url": image_url},
        }
    )

    response.set_cookie(
        key="vendor_session",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=86400,
    )

    return response


@router.post("/login")
def vendor_login(data: VendorLogin, db: Session = Depends(get_db)):
    credential = (
        db.query(VendorLoginCredential)
        .filter(VendorLoginCredential.email == data.email)
        .first()
    )

    if not credential or not verify_password(data.password, credential.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password ")

    token = create_session(db, VendorLoginCredential, "vendor_id", credential.vendor_id)

    response = JSONResponse(
        content={
            "success": True,
            "message": "Login Successfully",
            "vendor_id": credential.vendor_id,
        }
    )

    response.set_cookie(
        key="vendor_session",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=86400,
    )
    return response


@router.get("/dashboard")
def vendor_dashboard(request: Request, db: Session = Depends(get_db)):

    token = request.cookies.get("vendor_session")

    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    session_data = validate_session(db, VendorLoginCredential, token)

    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    return {
        "success": True,
        "message": "Welcome Vendor",
        "vendor_id": session_data.vendor_id,
    }


@router.get("/all")
def get_all_vendors(db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    return [
        {
            "id": v.id,
            "name": v.name,
            "image_url": v.image_url,
            "total_customers": len(v.customers),
        }
        for v in vendors
    ]


@router.delete("/delete/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):

    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor is not found ")

    db.delete(vendor)
    db.commit()

    return {"success": True, "message": "Vendor delete successfully"}


@router.post("/logout")
def logout_vendor(request: Request, db: Session = Depends(get_db)):

    try:
        token = request.cookies.get("vendor_session")

        if not token:
            response = JSONResponse({"success": True, "message": "Already logged out"})
            response.delete_cookie(
                key="vendor_session",
                httponly=True,
                samesite="none",
                secure=True,
                path="/",
            )
            return response

        session_data = validate_session(db, VendorLoginCredential, token)

        if session_data:
            invalidate_session(
                db, VendorLoginCredential, "vendor_id", session_data.vendor_id
            )

        response = JSONResponse({"success": True, "message": "Logout successful"})

        response.delete_cookie(
            key="vendor_session",
            httponly=True,
            samesite="none",
            secure=True,
            path="/",
        )

        return response

    except Exception as e:
        print("LOGOUT ERROR:", e)
        return JSONResponse(
            status_code=500, content={"success": False, "message": "Logout failed"}
        )


def get_current_vendor(request: Request, db: Session):
    token = request.cookies.get("vendor_session")

    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    session_data = validate_session(db, VendorLoginCredential, token)

    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    vendor = db.query(Vendor).filter(Vendor.id == session_data.vendor_id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    return vendor


@router.get("/me")
def get_vendor_me(request: Request, db: Session = Depends(get_db)):
    try:
        vendor = get_current_vendor(request, db)
        return {"logged_in": True, "vendor_id": vendor.id, "name": vendor.name}
    except HTTPException:
        return {"logged_in": False}


@router.get("/profile")
def get_vendor_profile(request: Request, db: Session = Depends(get_db)):
    vendor = get_current_vendor(request, db)

    credential = (
        db.query(VendorLoginCredential)
        .filter(VendorLoginCredential.vendor_id == vendor.id)
        .first()
    )

    return {
        "vendor": {
            "id": vendor.id,
            "name": vendor.name,
            "email": credential.email if credential else "",
            "image_url": vendor.image_url,
        }
    }


@router.patch("/profile")
def update_vendor_profile(
    request: Request,
    data: ProfileUpdate,
    db: Session = Depends(get_db),
):
    vendor = get_current_vendor(request, db)
    vendor.name = data.name
    db.commit()
    db.refresh(vendor)

    return {"success": True, "message": "Profile updated successfully"}



@router.get("/payment-analytics")
def get_payment_analytics(request: Request, db: Session = Depends(get_db)):
    vendor = get_current_vendor(request, db)

    today = date.today()
    today_start = today

    today_payments = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
        func.date(Payment.paid_at) == today_start,
    ).scalar() or 0

    month_start = date(today.year, today.month, 1)
    monthly_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
        func.date(Payment.paid_at) >= month_start,
    ).scalar() or 0

    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).scalar() or 0

    subscriptions = db.execute(
        subscription_table.select().where(
            subscription_table.c.vendor_id == vendor.id,
            subscription_table.c.is_active,
        )
    ).fetchall()

    pending_customer_payments = []
    for sub in subscriptions:
        customer = db.query(Customer).filter(Customer.id == sub.customer_id).first()
        if not customer:
            continue

        pending_amount = db.query(func.sum(DailyMilkRecord.amount)).filter(
            DailyMilkRecord.customer_id == customer.id,
            DailyMilkRecord.vendor_id == vendor.id,
            DailyMilkRecord.billed.is_(False),
        ).scalar() or 0

        if pending_amount > 0:
            pending_customer_payments.append({
                "customer_id": customer.id,
                "customer_name": customer.name,
                "pending_amount": float(pending_amount),
            })

    recent_payments = db.query(Payment).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).order_by(Payment.paid_at.desc()).limit(10).all()

    payments_list = []
    for p in recent_payments:
        customer = db.query(Customer).filter(Customer.id == p.customer_id).first()
        payments_list.append({
            "id": p.id,
            "customer_name": customer.name if customer else "Unknown",
            "amount": float(p.amount),
            "payment_method": p.payment_method.value,
            "bill_number": p.bill_number,
            "paid_at": p.paid_at.isoformat(),
        })

    return {
        "today_payments": float(today_payments),
        "monthly_revenue": float(monthly_revenue),
        "total_revenue": float(total_revenue),
        "pending_customer_payments": pending_customer_payments,
        "recent_payments": payments_list,
    }


@router.get("/payment-history")
def get_vendor_payment_history(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("vendor_session")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    credential = validate_session(db, VendorLoginCredential, token)
    if not credential:
        raise HTTPException(status_code=401, detail="Invalid session")

    vendor = db.query(Vendor).filter(Vendor.id == credential.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    payments = db.query(Payment).filter(
        Payment.vendor_id == vendor.id,
        Payment.status == PaymentStatus.success,
    ).order_by(Payment.paid_at.desc()).all()

    history = []
    for p in payments:
        customer = db.query(Customer).filter(Customer.id == p.customer_id).first()
        history.append({
            "id": p.id,
            "customer_id": p.customer_id,
            "customer_name": customer.name if customer else "Unknown",
            "amount": float(p.amount),
            "payment_method": p.payment_method.value,
            "bill_number": p.bill_number,
            "paid_at": p.paid_at.isoformat(),
        })

    return {"payments": history}
