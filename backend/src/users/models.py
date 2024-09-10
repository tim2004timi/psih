from pydantic import EmailStr
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


# class Admin(Base):
#     __tablename__ = "admins"
#
#     created_at: Mapped[datetime] = mapped_column(
#         DateTime, nullable=False, default=datetime.utcnow
#     )
#
#     email: Mapped[str] = mapped_column(nullable=False)
#     username: Mapped[str] = mapped_column(nullable=False)
#     hashed_password: Mapped[str] = mapped_column(nullable=False)
