from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Passenger(Base):
    __tablename__ = "passengers"
    
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(64), nullable=False)
    id_card = Column(String(32), nullable=False)
    id_card_type = Column(Integer, default=0, nullable=False)
    type = Column(Integer, default=0, nullable=False)
    phone = Column(String(20))
    email = Column(String(128))
    status = Column(String(32), default="active", nullable=False)
    created_at = Column(String(32), server_default=func.now())
    updated_at = Column(String(32), onupdate=func.now())
    
    user = relationship("User", back_populates="passengers")