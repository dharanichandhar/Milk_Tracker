"""merge all migration heads

Revision ID: a40a24697fd5
Revises: 50fdf0eebfda, add_milk_subscription_tables, drop_vendor_daily_analytics
Create Date: 2026-07-23 04:47:28.009480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a40a24697fd5'
down_revision: Union[str, Sequence[str], None] = ('50fdf0eebfda', 'drop_vendor_daily_analytics')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
