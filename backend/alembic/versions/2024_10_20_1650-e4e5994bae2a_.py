"""empty message

Revision ID: e4e5994bae2a
Revises: 42a0a661519a
Create Date: 2024-10-20 16:50:48.508385

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4e5994bae2a'
down_revision: Union[str, None] = '42a0a661519a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('modifications_in_order',
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('modification_id', sa.Integer(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['modification_id'], ['modifications.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_modifications_in_order_id'), 'modifications_in_order', ['id'], unique=False)
    op.drop_index('ix_products_in_order_id', table_name='products_in_order')
    op.drop_table('products_in_order')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products_in_order',
    sa.Column('amount', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('product_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('order_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name='products_in_order_order_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='products_in_order_product_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='products_in_order_pkey')
    )
    op.create_index('ix_products_in_order_id', 'products_in_order', ['id'], unique=False)
    op.drop_index(op.f('ix_modifications_in_order_id'), table_name='modifications_in_order')
    op.drop_table('modifications_in_order')
    # ### end Alembic commands ###