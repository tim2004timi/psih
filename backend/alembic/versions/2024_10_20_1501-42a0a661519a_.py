"""empty message

Revision ID: 42a0a661519a
Revises: 977405b04083
Create Date: 2024-10-20 15:01:21.977560

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "42a0a661519a"
down_revision: Union[str, None] = "977405b04083"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DELETE FROM files")
    op.execute("DELETE FROM products_in_order")

    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "modifications",
        sa.Column("article", sa.String(), nullable=False),
        sa.Column("size", sa.String(), nullable=False),
        sa.Column("remaining", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["product_id"],
            ["products.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_modifications_id"), "modifications", ["id"], unique=False)
    op.drop_column("products", "article")
    op.drop_column("products", "size")
    op.drop_column("products", "remaining")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "products",
        sa.Column("remaining", sa.INTEGER(), autoincrement=False, nullable=False),
    )
    op.add_column(
        "products", sa.Column("size", sa.VARCHAR(), autoincrement=False, nullable=False)
    )
    op.add_column(
        "products",
        sa.Column("article", sa.VARCHAR(), autoincrement=False, nullable=False),
    )
    op.drop_index(op.f("ix_modifications_id"), table_name="modifications")
    op.drop_table("modifications")
    # ### end Alembic commands ###