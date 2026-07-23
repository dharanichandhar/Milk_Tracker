from datetime import datetime, timezone
from app.database import SessionLocal
from app.models import CustomerLoginCrendential, VendorLoginCredential


def cleanup_expired_sessions():
    """
    Runs daily at 03:00 AM
    Removes expired session tokens
    """
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)

        db.query(CustomerLoginCrendential).filter(
            CustomerLoginCrendential.session_expires_at < now
        ).update({
            CustomerLoginCrendential.session_token: None,
            CustomerLoginCrendential.session_expires_at: None,
        })

        db.query(VendorLoginCredential).filter(
            VendorLoginCredential.session_expires_at < now
        ).update({
            VendorLoginCredential.session_token: None,
            VendorLoginCredential.session_expires_at: None,
        })

        db.commit()
        print("Cleaned up expired sessions")
    except Exception as e:
        db.rollback()
        print(f"Error cleaning up sessions: {e}")
    finally:
        db.close()
