from fastapi import (APIRouter,HTTPException,Request,UploadFile,Depends,Form,File,)
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Vendor, VendorLoginCredential
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from app.schema.schema import VendorLogin
from sqlalchemy.exc import IntegrityError
from app.cloudinary.cloudinary_service import upload_to_cloudinary
from app.utils.session import create_session, validate_session, invalidate_session


router = APIRouter(prefix="/api/vendors", tags=["vendors"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


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
        return {"success": False, "message": "Email already exists or DB issue"}

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
        samesite="lax",
        secure=False,
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
        samesite="lax",
        secure=False,
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


@router.get("/particular/{vendor_id}")
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):

    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    return {
        "success": True,
        "vendor": {
            "id": vendor.id,
            "name": vendor.name,
            "image_url": vendor.image_url,
            "customers": [
                {"id": customer.id, "name": customer.name}
                for customer in vendor.customers
            ],
        },
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

    vendor = db.query(Vendor).filter(vendor_id == Vendor.id).first()
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
            return {"success": True, "message": "Already logged out"}

        session_data = validate_session(db, VendorLoginCredential, token)

        if session_data:
            invalidate_session(
                db, VendorLoginCredential, "vendor_id", session_data.vendor_id
            )

        response = JSONResponse({"success": True, "message": "Logout successful"})

        response.delete_cookie("vendor_session")

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
