"""Update invoices table with new payment fields

Revision ID: update_invoices_payment_fields
Revises: add_invoices
Create Date: 2026-04-24 04:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "update_invoices_payment_fields"
down_revision: Union[str, Sequence[str], None] = "add_invoices"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "invoices",
        sa.Column("due_amount", sa.Float(), nullable=False, server_default="0.0"),
    )
    op.add_column(
        "invoices",
        sa.Column("paid_amount", sa.Float(), nullable=False, server_default="0.0"),
    )
    op.add_column(
        "invoices",
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "invoices",
        sa.Column("notes", sa.String(), nullable=True),
    )
    op.create_unique_constraint(
        "uq_invoice_customer_vendor_period",
        "invoices",
        ["customer_id", "month", "year", "vendor_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_invoice_customer_vendor_period", "invoices", type_="unique")
    op.drop_column("invoices", "notes")
    op.drop_column("invoices", "paid_at")
    op.drop_column("invoices", "paid_amount")
    op.drop_column("invoices", "due_amount")