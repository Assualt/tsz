import datetime
from pydantic import BaseModel


class SeatLeftTicket(BaseModel):
    business: int
    special: int
    first: int
    second: int
    lying: int
    super_soft_lying: int
    soft_lying: int
    hard_lying: int
    soft_seat: int
    hard_seat: int
    no_seat: int

class PriceInfo(BaseModel):
    seat_type: str
    price: float
    is_available: bool

class TicketSearchResult(BaseModel):
    train_num: str
    station_from: str
    station_to: str
    begin_time: datetime
    end_time: datetime
    seat_info: SeatLeftTicket
    price_info: list[PriceInfo]
    is_start: bool
    is_end: bool
