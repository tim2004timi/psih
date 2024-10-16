from sqlalchemy import DateTime, Table, ForeignKey, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from datetime import datetime

from ..database import Base


# user_role_association_table = Table(
#     "user_roles",
#     Base.metadata,
#     Column("user_id", ForeignKey("users.id"), primary_key=True),
#     Column("role_id", ForeignKey("roles.id"), primary_key=True),
# )


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True)
    # email: Mapped[str] = mapped_column(unique=True)
    tg_username: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[bytes]
    admin: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    access_storage: Mapped[bool] = mapped_column(default=False)
    access_crm: Mapped[bool] = mapped_column(default=False)
    access_message: Mapped[bool] = mapped_column(default=False)
    access_analytics: Mapped[bool] = mapped_column(default=False)

    # roles: Mapped[list["Role"]] = relationship(
    #     "Role",
    #     secondary=user_role_association_table,
    #     back_populates="users",
    # )


#
# class Role(Base):
#     __tablename__ = "roles"
#
#     name: Mapped[str] = mapped_column(unique=True)
#
#     # Связь многие ко многим с таблицей User
#     users: Mapped[list[User]] = relationship(
#         "User", secondary=user_role_association_table, back_populates="roles"
#     )
