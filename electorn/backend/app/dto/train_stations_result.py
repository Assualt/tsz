from datetime import datetime
from pydantic import BaseModel


class TrainStationsResult(BaseModel):
    train_num: str
    station_name: str
    station_code: str
    arrival_time: datetime
    left_time: datetime
    is_start: bool
    is_end: bool