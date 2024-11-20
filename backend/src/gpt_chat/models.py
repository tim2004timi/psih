from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class GPTMessage(Base):
    __tablename__ = "gpt_messages"

    role: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    user: Mapped["User"] = relationship(back_populates="gpt_messages")
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))