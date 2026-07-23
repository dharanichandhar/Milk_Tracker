"""Add rates milk_logs tables and subscription default_quantity

Revision ID: add_rates_milk_logs
Revises: 22cbe1496676
Create Date: 2026-04-23 10:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_rates_milk_logs"
down_revision: Union[str, Sequence[str], None] = "50fdf0eebfda"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "rates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("vendor_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("price_per_litre", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["vendor_id"], ["vendors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_rates_id"), "rates", ["id"], unique=False)
    op.create_index(op.f("ix_rates_vendor_id"), "rates", ["vendor_id"], unique=False)

    op.create_table(
        "milk_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("vendor_id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("quantity", sa.Float(), nullable=False),
        sa.Column("price_per_litre", sa.Float(), nullable=False),
        sa.Column("total_amount", sa.Float(), nullable=False),
        sa.Column("is_override", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["vendor_id"], ["vendors.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_milk_logs_id"), "milk_logs", ["id"], unique=False)
    op.create_index(op.f("ix_milk_logs_vendor_id"), "milk_logs", ["vendor_id"], unique=False)
    op.create_index(op.f("ix_milk_logs_customer_id"), "milk_logs", ["customer_id"], unique=False)

    op.add_column(
        "subscription",
        sa.Column(
            "default_quantity",
            sa.Numeric(10, 2),
            nullable=False,
            server_default="1.0",
        ),
    )


def downgrade() -> None:
    op.drop_column("subscription", "default_quantity")
    op.drop_index(op.f("ix_milk_logs_customer_id"), table_name="milk_logs")
    op.drop_index(op.f("ix_milk_logs_vendor_id"), table_name="milk_logs")
    op.drop_index(op.f("ix_milk_logs_id"), table_name="milk_logs")
    op.drop_table("milk_logs")
    op.drop_index(op.f("ix_rates_vendor_id"), table_name="rates")
    op.drop_index(op.f("ix_rates_id"), table_name="rates")
    op.drop_table("rates")