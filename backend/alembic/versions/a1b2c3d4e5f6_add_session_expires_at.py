"""add_session_expires_at

Revision ID: a1b2c3d4e5f6
Revises: bb1d13b3873c
Create Date: 2026-04-07 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "bb1d13b3873c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "customer_login_credentials",
        sa.Column("session_expires_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("customer_login_credentials", "session_expires_at")
