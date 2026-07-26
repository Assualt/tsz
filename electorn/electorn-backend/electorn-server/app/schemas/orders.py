from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderBase(BaseModel):
    order_no: str
    train_num: str
    train_date: str
    train_start_time: Optional[str] = None
    train_end_time: Optional[str] = None
    from_station: str
    to_station: str
    seat_type: str
    passenger_name: str
    passenger_id_card: str
    passenger_count: int = 1
    price: float
    status: str = "pending"


class OrderCreate(BaseModel):
    train_num: str
    train_date: str
    train_start_time: Optional[str] = None
    train_end_time: Optional[str] = None
    from_station: str
    to_station: str
    seat_type: str
    passenger_name: str
    passenger_id_card: str
    passenger_count: int = 1
    price: float
    payment_method: Optional[str] = None


class Order(OrderBase):
    id: int
    payment_method: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderList(BaseModel):
    data: List[Order]
    total: int


class OrderPay(BaseModel):
    payment_method: str