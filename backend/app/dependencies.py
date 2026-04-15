from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Customer
from app.utils.session import validate_session


def get_session_token(request: Request) -> str | None:
    return request.cookies.get("session_id")


def get_current_customer(
    request: Request,
    db: Session = Depends(get_db),
    ) -> Customer:
    token = get_session_token(request)
    credential = validate_session(db, token)

    if not credential:
        raise HTTPException(status_code=401, detail="Not authenticated")

    customer = db.query(Customer).filter(Customer.id == credential.customer_id).first()

    if not customer:
        raise HTTPException(status_code=401, detail="Customer not found")

    return customer
