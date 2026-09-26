from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime


from datetime import datetime

class StationBase(BaseModel):
    name: str
    code: str
    city_id: int
    address: str
    level: int = 0
    description: Optional[str] = None
    keyword: Optional[str] = None
    open_date: Optional[datetime] = None

class StationCreate(StationBase):
    pass

class StationUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    city_id: Optional[int] = None
    address: Optional[str] = None
    level: Optional[int] = None
    description: Optional[str] = None
    keyword: Optional[str] = None
    open_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class StationBrief(BaseModel):
    id: int
    name: str
    code: str
    city_id: int
    address: str
    level: int
    open_date: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Station(StationBrief):
    description: Optional[str] = None
    keyword: Optional[str] = None

    class Config:
        from_attributes = True

class StationWithCity(Station):
    city_name: str
    city_code: str
    province: str

class StationBaseList(BaseModel):
    data: List[Dict[str, Any]]

class StationList(StationBaseList):
    total: Optional[int] = None
    page_num: Optional[int] = None
    cur_page: Optional[int] = None
