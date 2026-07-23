from alembic import op
import sqlalchemy as sa


revision = "drop_vendor_daily_analytics"
down_revision = "add_milk_subscription_tables"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table("vendor_daily_analytics")


def downgrade():
    op.create_table(
        "vendor_daily_analytics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("vendor_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("total_quantity", sa.Numeric(10, 2), nullable=True),
        sa.Column("total_revenue", sa.Numeric(10, 2), nullable=True),
        sa.Column("active_customers", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["vendor_id"], ["vendors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
