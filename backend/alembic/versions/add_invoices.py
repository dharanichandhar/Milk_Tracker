"""Add invoices table

Revision ID: add_invoices
Revises: add_rates_milk_logs
Create Date: 2026-04-24 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_invoices"
down_revision: Union[str, Sequence[str], None] = "add_rates_milk_logs"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("vendor_id", sa.Integer(), nullable=False),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("total_amount", sa.Float(), nullable=False),
        sa.Column("total_quantity", sa.Float(), nullable=False),
        sa.Column("days_with_milk", sa.Integer(), nullable=False),
        sa.Column("payment_status", sa.String(), nullable=False),
        sa.Column("invoice_number", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["vendor_id"], ["vendors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_invoices_id"), "invoices", ["id"], unique=False)
    op.create_index(op.f("ix_invoices_customer_id"), "invoices", ["customer_id"], unique=False)
    op.create_index(op.f("ix_invoices_vendor_id"), "invoices", ["vendor_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_invoices_vendor_id"), table_name="invoices")
    op.drop_index(op.f("ix_invoices_customer_id"), table_name="invoices")
    op.drop_index(op.f("ix_invoices_id"), table_name="invoices")
    op.drop_table("invoices")