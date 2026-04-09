from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

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
def create_customer(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    customer = Customer(name=name)
    db.add(customer)
    db.flush()

    password_hash = get_password_hash(password)

    customer_login_credential = CustomerLoginCrendential(
        customer_id=customer.id, email=email, password_hash=password_hash
    )

    db.add(customer_login_credential)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return RedirectResponse(url="/signup?error=1", status_code=303)

    token = create_session(db, customer.id)
    response = RedirectResponse(
        url=f"/subscription?customer_id={customer.id}", status_code=303
    )
    response.set_cookie(
        key="session_id",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=86400,
    )
    return response


@router.post("/login")
def login_customer(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    credential = (
        db.query(CustomerLoginCrendential)
        .filter(CustomerLoginCrendential.email == email)
        .first()
    )

    if not credential or not verify_password(password, credential.password_hash):
        return RedirectResponse(url="/login?error=1", status_code=401)

    token = create_session(db, credential.customer_id)
    response = RedirectResponse(
        url=f"/subscription?customer_id={credential.customer_id}", status_code=303
    )
    response.set_cookie(
        key="session_id",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=86400,
    )
    return response


@router.post("/logout")
def logout_customer(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("session_id")
    credential = validate_session(db, token)

    if credential:
        invalidate_session(db, credential.customer_id)

    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie(key="session_id")
    return response


# @router.post("/create")
# def create_customer(name : str = Form(...),
#                     email : str = Form(...),
#                      password : str = Form(...), db : Session  = Depends(get_db)):
#     customer = Customer(name = name)
#     db.add(customer)
#     db.flush()

#     password_hash = get_password_hash(password)

#     customer_login_credential = CustomerLoginCrendential(customer_id = customer.id,
#                                                         email = email,
#                                                          password_hash = password_hash )

#     db.add(customer_login_credential)
#     try:
#         db.commit()
#     except IntegrityError:
#         db.rollback()
#         raise HTTPException(status_code=400, detail="Email already exists")

#     return{
#         "message" : "Customer created successfully",
#         "customer_id" : customer.id
#     }


# @router.post("/login")
# def login_customer(email: str = Form(...),
#                    password : str = Form(...),
#                      db:Session = Depends(get_db)):

#     customer = db.query(CustomerLoginCrendential).filter(CustomerLoginCrendential.email == email).first()

#     if customer is None:
#         raise HTTPException(status_code=404, detail="Email id is incorrect")

#     if not verify_password(password, customer.password_hash):
#         raise HTTPException(status_code=401 , detail="Password is incorrect")

#     return {"message" : "Logged in Successfully"}


# @router.get("/get_all_customer")
# def get_all_customers(db: Session = Depends(get_db)):
#     customers = db.query(Customer).order_by(Customer.name).all()

#     return [
#         {
#             "id" : c.id, "name" : c.name }
#             for c in customers
#     ]

# @router.get("particular")
# def get_customer(customer_id : int , db : Session = Depends(get_db)):
#     customer = db.query(Customer).filter(Customer.id == customer_id).first()

#     if not customer :
#         raise HTTPException(status_code=404, detail = "Customer not found")

#     return {
#         "id" : customer.id,
#         "name" : customer.name,
#         "vendors" : customer.vendors
#     }
