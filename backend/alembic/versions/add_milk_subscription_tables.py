"""Add new tables for milk subscription system

Revision ID: add_milk_subscription_tables
Revises: 
Create Date: 2026-05-02

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_milk_subscription_tables'
down_revision = '22cbe1496676'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to subscription table
    # Note: default_quantity is created by the add_rates_milk_logs migration
    op.add_column('subscription', sa.Column('is_active', sa.Boolean(), default=True))
    op.add_column('subscription', sa.Column('subscribed_at', sa.DateTime(timezone=True)))

    # Create milk_prices table
    op.create_table(
        'milk_prices',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('vendor_id', sa.Integer(), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('price_per_liter', sa.Numeric(10, 2), nullable=False),
        sa.Column('effective_from', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_milk_prices_vendor_id', 'milk_prices', ['vendor_id'])

    # Create daily_milk_records table
    op.create_table(
        'daily_milk_records',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('vendor_id', sa.Integer(), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('quantity', sa.Numeric(10, 2), nullable=False),
        sa.Column('price_per_liter', sa.Numeric(10, 2), nullable=False),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_override', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_daily_milk_records_customer_id', 'daily_milk_records', ['customer_id'])
    op.create_index('ix_daily_milk_records_vendor_id', 'daily_milk_records', ['vendor_id'])
    op.create_index('ix_daily_milk_records_date', 'daily_milk_records', ['date'])

    # Create bills table
    op.create_table(
        'bills',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('vendor_id', sa.Integer(), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('bill_number', sa.String(), unique=True, nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('bill_type', sa.Enum('weekly', 'monthly', 'custom', name='billtype'), default='custom'),
        sa.Column('total_quantity', sa.Numeric(10, 2), default=0),
        sa.Column('subtotal', sa.Numeric(10, 2), default=0),
        sa.Column('total_amount', sa.Numeric(10, 2), default=0),
        sa.Column('status', sa.Enum('pending', 'paid', 'failed', name='billstatus'), default='pending'),
        sa.Column('razorpay_order_id', sa.String(), nullable=True),
        sa.Column('razorpay_payment_id', sa.String(), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_bills_customer_id', 'bills', ['customer_id'])
    op.create_index('ix_bills_vendor_id', 'bills', ['vendor_id'])
    op.create_index('ix_bills_status', 'bills', ['status'])

    # Create bill_items table
    op.create_table(
        'bill_items',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('bill_id', sa.Integer(), sa.ForeignKey('bills.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('quantity', sa.Numeric(10, 2), nullable=False),
        sa.Column('price_per_liter', sa.Numeric(10, 2), nullable=False),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
    )
    op.create_index('ix_bill_items_bill_id', 'bill_items', ['bill_id'])

    # Create vendor_daily_analytics table
    op.create_table(
        'vendor_daily_analytics',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('vendor_id', sa.Integer(), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('total_quantity', sa.Numeric(10, 2), default=0),
        sa.Column('total_revenue', sa.Numeric(10, 2), default=0),
        sa.Column('active_customers', sa.Integer(), default=0),
    )
    op.create_index('ix_vendor_daily_analytics_vendor_id', 'vendor_daily_analytics', ['vendor_id'])
    op.create_index('ix_vendor_daily_analytics_date', 'vendor_daily_analytics', ['date'])


def downgrade():
    op.drop_table('vendor_daily_analytics')
    op.drop_table('bill_items')
    op.drop_table('bills')
    op.drop_table('daily_milk_records')
    op.drop_table('milk_prices')
    
    op.drop_column('subscription', 'subscribed_at')
    op.drop_column('subscription', 'is_active')
    # Note: default_quantity is dropped by the add_rates_milk_logs migration
    
    op.execute('DROP TYPE IF EXISTS billstatus')
    op.execute('DROP TYPE IF EXISTS billtype')
