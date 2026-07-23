"""Add billed column to daily_milk_records and create payments table

Revision ID: add_billed_and_payments
Revises: 121c1184c09d
Create Date: 2026-07-23 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_billed_and_payments"
down_revision: Union[str, Sequence[str], None] = "121c1184c09d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "daily_milk_records",
        sa.Column("billed", sa.Boolean(), server_default="false", nullable=False),
    )

    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "customer_id",
            sa.Integer(),
            sa.ForeignKey("customers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "vendor_id",
            sa.Integer(),
            sa.ForeignKey("vendors.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column(
            "payment_method",
            sa.Enum("upi", "card", "cash", name="paymentmethod"),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum("success", "failed", "pending", name="paymentstatus"),
            server_default="success",
        ),
        sa.Column("bill_number", sa.String(), nullable=False),
        sa.Column("paid_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("payments")
    op.execute("DROP TYPE IF EXISTS paymentstatus")
    op.execute("DROP TYPE IF EXISTS paymentmethod")
    op.drop_column("daily_milk_records", "billed")
