import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session


SESSION_DURATION_HOURS = 24



def generate_session_token() -> str:
    return secrets.token_hex(32)


def get_session_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=SESSION_DURATION_HOURS)


def create_session(db: Session, model , id_field: str , user_id: int) -> str:
    credential = (
        db.query(model).filter(getattr(model , id_field) == user_id) .first()
    )

    if not credential:
        return None

    token = generate_session_token()
    credential.session_token = token
    credential.session_expires_at = get_session_expiry()

    db.commit()
    db.refresh(credential)

    return token


def validate_session(db: Session, model , token: str | None):
    if not token:
        return None

    credential = (
        db.query(model).filter(model.session_token == token).first()
    )

    if not credential:
        return None

    if credential.session_expires_at and credential.session_expires_at < datetime.now(timezone.utc):
        return None

    return credential


def invalidate_session(db: Session, model, id_field: str, user_id: int):

    try:
        credential = (
            db.query(model)
            .filter(getattr(model, id_field) == user_id)
            .first()
        )

        if credential:
            credential.session_token = None
            credential.session_expires_at = None

            db.commit()

        return True

    except Exception as e:
        db.rollback()
        print("invalidate_session error:", e)
        return False