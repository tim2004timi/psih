"""empty message

Revision ID: b24d1f371866
Revises: 23b01864331f
Create Date: 2024-09-27 02:51:36.243912

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b24d1f371866"
down_revision: Union[str, None] = "23b01864331f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DELETE FROM product_images")

    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("product_images", sa.Column("url", sa.String(), nullable=False))
    op.drop_column("product_images", "filename")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "product_images",
        sa.Column("filename", sa.VARCHAR(), autoincrement=False, nullable=False),
    )
    op.drop_column("product_images", "url")
    # ### end Alembic commands ###