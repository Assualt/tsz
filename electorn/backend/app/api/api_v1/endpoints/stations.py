from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.response import SuccessResponse
from app.core.logging_config import console
from app.core.logging_config import trans
from app.models.stations import Station as StationModel
from app.models.city import City
from app.schemas.stations import StationList, StationCreate, StationUpdate, Station, StationWithCity


router = APIRouter()

@router.get("")
def get_stations(per_page: int = 10, page: int = 1, db: Session = Depends(get_db)):
    """
    Get all stations with pagination
    """
    # 使用数据库进行查询，且使用分页进行查询
    stations = db.query(StationModel).limit(per_page).offset((page - 1) * per_page).all()
    total = db.query(StationModel).count()
    page_num = total // per_page + (total % per_page > 0)
    
    # 车站等级映射
    level_map = {
        0: "特等站",
        1: "一等站",
        2: "二等站",
        3: "三等站",
        4: "四等站",
        5: "五等站"
    }
    
    # 转换为包含城市信息的字典列表
    stations_data_list = []
    for station in stations:
        station_data = {
            "id": station.id,
            "name": station.name,
            "code": station.code,
            "city_id": station.city_id,
            "city_name": station.city.name if station.city else None,
            "address": station.address,
            "level": station.level,
            "level_name": level_map.get(station.level, "未知"),
            "open_date": station.open_date,
            "is_active": station.is_active,
            "created_at": station.created_at,
            "updated_at": station.updated_at,
            "description": station.description,
            "keyword": station.keyword
        }
        stations_data_list.append(station_data)
    
    # 使用 StationList 填充 data 返回体
    station_list = StationList(
        data=stations_data_list,
        total=total,
        page_num=page_num,
        cur_page=page
    )

    # 记录日志
    console.info("Get stations with pagination", extra={"extra_data": {"count": len(stations_data_list), "page": page, "per_page": per_page}})
    trans.info("Get stations with pagination", extra={"extra_data": {"count": len(stations_data_list), "page": page, "per_page": per_page, "total": total}})

    return SuccessResponse(data=station_list)


@router.get("/{station_id}")
def get_station(station_id: int, db: Session = Depends(get_db)):
    """
    Get station by id with city information
    """
    # 车站等级映射
    level_map = {
        0: "特等站",
        1: "一等站",
        2: "二等站",
        3: "三等站",
        4: "四等站",
        5: "五等站"
    }
    
    # 查询车站信息，包含城市信息
    station = db.query(StationModel).filter(StationModel.id == station_id).first()
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Station with id {station_id} not found")
    
    # 构建包含城市信息的响应
    station_with_city = {
        "id": station.id,
        "name": station.name,
        "code": station.code,
        "city_id": station.city_id,
        "city_name": station.city.name if station.city else None,
        "city_code": station.city.code if station.city else None,
        "province": station.city.province if station.city else None,
        "address": station.address,
        "level": station.level,
        "level_name": level_map.get(station.level, "未知"),
        "open_date": station.open_date,
        "is_active": station.is_active,
        "created_at": station.created_at,
        "updated_at": station.updated_at,
        "description": station.description,
        "keyword": station.keyword
    }
    
    # 记录日志
    console.info("Get station by id", extra={"extra_data": {"station_id": station_id, "station_name": station.name}})
    trans.info("Get station by id", extra={"extra_data": {"station_id": station_id, "station_name": station.name}})

    # 只返回车站详细信息，不包含分页相关字段
    return SuccessResponse(data=station_with_city)


@router.post("")
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    """
    Create a new station
    """
    # 车站等级映射
    level_map = {
        0: "特等站",
        1: "一等站",
        2: "二等站",
        3: "三等站",
        4: "四等站",
        5: "五等站"
    }
    
    # 检查城市是否存在
    city = db.query(City).filter(City.id == station.city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"City with id {station.city_id} not found")
    
    # 检查车站代码是否已存在
    existing_station = db.query(StationModel).filter(StationModel.code == station.code).first()
    if existing_station:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Station with code {station.code} already exists")
    
    # 创建车站
    db_station = StationModel(**station.model_dump())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    
    # 记录日志
    console.info("Create station", extra={"extra_data": {"station_id": db_station.id, "station_name": station.name, "station_code": station.code}})
    trans.info("Create station", extra={"extra_data": {"station_id": db_station.id, "station_name": station.name, "station_code": station.code, "city_id": station.city_id}})
    
    # 构建包含城市信息的响应
    station_with_city = {
        "id": db_station.id,
        "name": db_station.name,
        "code": db_station.code,
        "city_id": db_station.city_id,
        "city_name": city.name,
        "city_code": city.code,
        "province": city.province,
        "address": db_station.address,
        "level": db_station.level,
        "level_name": level_map.get(db_station.level, "未知"),
        "open_date": db_station.open_date,
        "is_active": db_station.is_active,
        "created_at": db_station.created_at,
        "updated_at": db_station.updated_at,
        "description": db_station.description,
        "keyword": db_station.keyword
    }
    
    # 返回包含城市信息的响应
    return SuccessResponse(data=station_with_city)


@router.put("/{station_id}")
def update_station(station_id: int, station_update: StationUpdate, db: Session = Depends(get_db)):
    """
    Update station by id
    """
    # 车站等级映射
    level_map = {
        0: "特等站",
        1: "一等站",
        2: "二等站",
        3: "三等站",
        4: "四等站",
        5: "五等站"
    }
    
    # 查找车站
    station = db.query(StationModel).filter(StationModel.id == station_id).first()
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Station with id {station_id} not found")
    
    # 检查城市是否存在
    city_id = station_update.city_id if station_update.city_id else station.city_id
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"City with id {city_id} not found")
    
    # 检查车站代码是否已被其他车站使用
    if station_update.code and station_update.code != station.code:
        existing_station = db.query(StationModel).filter(StationModel.code == station_update.code).first()
        if existing_station:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Station with code {station_update.code} already exists")
    
    # 更新车站信息
    update_data = station_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(station, field, value)
    
    db.commit()
    db.refresh(station)
    
    # 记录日志
    console.info("Update station", extra={"extra_data": {"station_id": station_id, "station_name": station.name}})
    trans.info("Update station", extra={"extra_data": {"station_id": station_id, "station_name": station.name, "update_data": update_data}})
    
    # 构建包含城市信息的响应
    station_with_city = {
        "id": station.id,
        "name": station.name,
        "code": station.code,
        "city_id": station.city_id,
        "city_name": city.name,
        "city_code": city.code,
        "province": city.province,
        "address": station.address,
        "level": station.level,
        "level_name": level_map.get(station.level, "未知"),
        "open_date": station.open_date,
        "is_active": station.is_active,
        "created_at": station.created_at,
        "updated_at": station.updated_at,
        "description": station.description,
        "keyword": station.keyword
    }
    
    # 返回包含城市信息的响应
    return SuccessResponse(data=station_with_city)


@router.delete("/{station_id}")
def delete_station(station_id: int, db: Session = Depends(get_db)):
    """
    Delete station by id
    """
    # 查找车站
    station = db.query(StationModel).filter(StationModel.id == station_id).first()
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Station with id {station_id} not found")
    
    # 记录日志
    console.info("Delete station", extra={"extra_data": {"station_id": station_id, "station_name": station.name}})
    trans.info("Delete station", extra={"extra_data": {"station_id": station_id, "station_name": station.name}})
    
    # 删除车站
    db.delete(station)
    db.commit()
    
    return SuccessResponse(data={"message": "Station deleted successfully"})