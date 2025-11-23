from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from .database import Base

# the Incident is the SQLALchemy model
class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    desc = Column(Text)
    status = Column(String(50), default="Open")
    priority = Column(String(50), default="Medium")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())

    __table_args__ = (
        CheckConstraint("status IN ('Open', 'In_Progress', 'Resolved')"),
        CheckConstraint("priority IN ('Low', 'Medium', 'High')"),
    )