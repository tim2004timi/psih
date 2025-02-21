from datetime import datetime
from typing import Optional, List

from sqlalchemy import DateTime, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from src.database import Base


class ChannelAutoReply(Base):
    __tablename__ = "channel_auto_reply"

    photo_file_id: Mapped[Optional[str]] = mapped_column(nullable=True)
    text: Mapped[Optional[str]] = mapped_column(nullable=True)
    buttons: Mapped[Optional[List[dict]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )


