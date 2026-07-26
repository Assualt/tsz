from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    order_no = Column(String(64), unique=True, index=True, nullable=False)
    train_num = Column(String(32), nullable=False)
    train_date = Column(String(32), nullable=False)
    train_start_time = Column(String(32), nullable=True)
    train_end_time = Column(String(32), nullable=True)
    from_station = Column(String(64), nullable=False)
    to_station = Column(String(64), nullable=False)
    seat_type = Column(String(32), nullable=False)
    passenger_name = Column(String(64), nullable=False)
    passenger_id_card = Column(String(32), nullable=False)
    passenger_count = Column(Integer, default=1, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Enum("pending", "paid", "cancelled", "completed", "refunded"), default="pending", nullable=False)
    payment_method = Column(String(32), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())