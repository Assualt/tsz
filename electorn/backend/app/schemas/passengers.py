from pydantic import BaseModel
from typing import List, Optional, Any


class PassengerBase(BaseModel):
    name: str
    id_card: str
    id_card_type: Any = 0
    type: Any = 0
    phone: Optional[str] = None
    email: Optional[str] = None


class PassengerCreate(PassengerBase):
    pass


class PassengerUpdate(BaseModel):
    name: Optional[str] = None
    id_card: Optional[str] = None
    id_card_type: Optional[Any] = None
    type: Optional[Any] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None


class Passenger(PassengerBase):
    id: int
    user_id: int
    status: str
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class PassengerList(BaseModel):
    data: List[Passenger]
    total: int