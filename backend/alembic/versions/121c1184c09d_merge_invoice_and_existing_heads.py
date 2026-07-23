"""merge invoice and existing heads

Revision ID: 121c1184c09d
Revises: a40a24697fd5, update_invoices_payment_fields
Create Date: 2026-07-23 12:44:04.040092

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '121c1184c09d'
down_revision: Union[str, Sequence[str], None] = ('a40a24697fd5', 'update_invoices_payment_fields')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
