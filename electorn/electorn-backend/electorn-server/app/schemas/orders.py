from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class OrderBase(BaseModel):
    order_no: str
    train_num: str
    train_date: str
    from_station: str
    to_station: str
    seat_type: str
    passenger_name: str
    passenger_id_card: str
    price: float
    status: str = "pending"


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderList(BaseModel):
    data: List[Order]
    total: int