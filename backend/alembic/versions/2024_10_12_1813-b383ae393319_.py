"""empty message

Revision ID: b383ae393319
Revises: b9cb7eb1b347
Create Date: 2024-10-12 18:13:12.304816

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b383ae393319'
down_revision: Union[str, None] = 'b9cb7eb1b347'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('files',
    sa.Column('url', sa.String(), nullable=False),
    sa.Column('image', sa.Boolean(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('owner_type', sa.String(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_files_id'), 'files', ['id'], unique=False)
    op.drop_index('ix_product_images_id', table_name='product_images')
    op.drop_table('product_images')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('product_images',
    sa.Column('product_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('url', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='product_images_product_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='product_images_pkey')
    )
    op.create_index('ix_product_images_id', 'product_images', ['id'], unique=False)
    op.drop_index(op.f('ix_files_id'), table_name='files')
    op.drop_table('files')
    # ### end Alembic commands ###
