from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from app.schema.schema import CustomerSingup, CustomerLogin
from app.database import get_db
from app.models import Customer, CustomerLoginCrendential
from app.utils.session import create_session, invalidate_session, validate_session


router = APIRouter(prefix="/api/customers", tags=["Customers"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/create")
def create_customer(data: CustomerSingup, db: Session = Depends(get_db)):
    customer = Customer(name=data.name)
    db.add(customer)
    db.flush()

    password_hash = get_password_hash(data.password)

    customer_login_credential = CustomerLoginCrendential(
        customer_id=customer.id, email=data.email, password_hash=password_hash
    )

    db.add(customer_login_credential)

    try:
        db.commit()
        db.refresh(customer_login_credential)
    except IntegrityError:
        db.rollback()
        return {"success": False, "message": "Email already exists"}

    token = create_session(db, CustomerLoginCrendential, "customer_id", customer.id)

    response = JSONResponse(
        content={
            "success": True,
            "message": "Signup successfully",
            "customer_id": customer.id,
        }
    )

    response.set_cookie(
        key="customer_session",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=86400,
    )

    return response


@router.post("/login")
def customer_login(data: CustomerLogin, db: Session = Depends(get_db)):
    credential = (
        db.query(CustomerLoginCrendential)
        .filter(CustomerLoginCrendential.email == data.email)
        .first()
    )

    if not credential or not verify_password(data.password, credential.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_session(
        db, CustomerLoginCrendential, "customer_id", credential.customer_id
    )

    response = JSONResponse(content={"success": True, "message": "Login Successfully"})

    response.set_cookie(
        key="customer_session",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=86400,
    )

    return response


@router.post("/logout")
def logout_customer(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("customer_session")
    credential = validate_session(db, CustomerLoginCrendential, token)

    if credential:
        invalidate_session(
            db, CustomerLoginCrendential, "customer_id", credential.customer_id
        )

    response = JSONResponse(content={"success": True, "message": "Logout successfully"})
    response.delete_cookie(key="customer_session")
    return response


def get_current_customer(request: Request, db: Session):
    token = request.cookies.get("customer_session")

    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    session_data = validate_session(db, CustomerLoginCrendential, token)

    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid session")

    customer = (
        db.query(Customer).filter(Customer.id == session_data.customer_id).first()
    )

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    return customer


@router.get("/me")
def get_customer_me(request: Request, db: Session = Depends(get_db)):
    try:
        customer = get_current_customer(request, db)
        return {"logged_in": True, "customer_id": customer.id, "name": customer.name}
    except HTTPException:
        return {"logged_in": False}
