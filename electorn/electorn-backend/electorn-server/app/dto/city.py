from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CityBase(BaseModel):
    name: str
    code: str
    province: str
    level: str
    population: Optional[str] = None
    area: Optional[str] = None
    zip_code: Optional[str] = None
    description: Optional[str] = None

class CityCreate(CityBase):
    pass

class CityUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    province: Optional[str] = None
    level: Optional[str] = None
    population: Optional[str] = None
    area: Optional[str] = None
    zip_code: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class CityBrief(BaseModel):
    id: int
    name: str
    code: str
    province: str
    level: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CityDetail(CityBrief):
    population: Optional[str] = None
    area: Optional[str] = None
    zip_code: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        from_attributes = True