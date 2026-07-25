from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.logging_config import trans
from app.dto.train_stations_result import TrainStationsResult
from app.schemas.response import SuccessResponse
from app.core.database import get_db

router = APIRouter()

@router.get("/query")
def query_ticket(from_station: str, to_station: str, date: datetime, db: Session = Depends(get_db)):
    """
    Query tickets
    """
    # 记录日志
    trans.info("Query tickets", extra={"extra_data": {
        "from_station": from_station,
        "to_station": to_station,
        "date": date.isoformat()
    }})
    
    # Mock 数据
    # 这里应该根据 from_station, to_station 和 date 查询数据库
    # 暂时返回 mock 数据
    ticket_data = {
        "train_num": "G1",
        "station_from": from_station,
        "station_to": to_station,
        "begin_time": datetime.now().isoformat(),
        "end_time": datetime.now().isoformat(),
        "seatInfo": {
            "business": 100,
            "special": 50,
            "first": 20,
            "second": 10,
            "lying": 5,
            "super_soft_lying": 2,
            "soft_lying": 1,
            "hard_lying": 0,
            "soft_seat": 100,
            "hard_seat": 50,
            "no_seat": 20,
        },
        "priceInfo": [{
            "seat_type": "business",
            "price": 100,
            "is_available": True,
        }],
        "isStart": True,
        "isEnd": True,
    }
    
    return SuccessResponse(data=[ticket_data])


# 根据train_num 查询获取路过的站台信息
@router.get("/station")
def get_ticket_trains(
    train_num: str,
    date: datetime = None,
    db: Session = Depends(get_db)
):
    """
    Get train stations by train number
    """
    # 如果没有提供日期，使用当前日期
    if date is None:
        date = datetime.now()
    
    # 记录日志
    trans.info("Get train stations", extra={"extra_data": {
        "train_num": train_num,
        "date": date.isoformat()
    }})
    
    # Mock 数据
    # 这里应该根据 train_num 和 date 查询数据库
    # 暂时返回 mock 数据
    train_stations = []
    stations = ["Station A", "Station B", "Station C"]
    codes = ["A", "B", "C"]
    
    for i in range(len(stations)):
        train_stations.append(TrainStationsResult(
            train_num=train_num,
            station_name=stations[i],
            station_code=codes[i],
            arrival_time=datetime.now() + timedelta(minutes=i),
            left_time=datetime.now() + timedelta(minutes=i),
            is_start= i == 0,
            is_end= i == len(stations) - 1,
        ))

    return SuccessResponse(data=train_stations)

@router.get("/{train_num}/prices")
async def get_ticket_prices(train_num: str, date: datetime = datetime.now(), db: Session = Depends(get_db)):
    """
    Get ticket prices
    """
    # 记录日志
    trans.info("Get ticket prices", extra={"extra_data": {
        "train_num": train_num,
        "date": date.isoformat()
    }})

    # Mock 数据
    # 这里应该根据 train_num 和 date 查询数据库
    # 暂时返回 mock 数据
    ticket_prices = {
        "train_num": train_num,
        "business": 100,
        "special": 50,
        "first": 20,
        "second": 10,
        "lying": 5,
        "super_soft_lying": 2,
        "soft_lying": 1,
        "hard_lying": 0,
        "soft_seat": 100,
        "hard_seat": 50,
        "no_seat": 20,
    
    }

    return SuccessResponse(data=ticket_prices)


@router.get("/{train_num}/detail")
async def get_train_detail(train_num: str, date: str = None, db: Session = Depends(get_db)):
    """
    Get train detail by train number
    """
    if date is None:
        date = datetime.now().strftime("%Y_%m_%d")
    
    trans.info("Get train detail", extra={"extra_data": {
        "train_num": train_num,
        "date": date
    }})

    date_str = date.replace("_", "-")
    
    data = {
        "train_num": train_num,
        "train_date": date_str,
        "train_from": "北京南",
        "train_to": "上海虹桥",
        "train_start_time": f"{date_str} 08:00:00",
        "train_end_time": f"{date_str} 12:30:00",
        "ticket": [
            {"seatType": "business", "price": 1888, "left": 5},
            {"seatType": "first", "price": 944, "left": 15},
            {"seatType": "second", "price": 576, "left": 120},
            {"seatType": "special", "price": 760, "left": 8}
        ]
    }

    return SuccessResponse(data=data)