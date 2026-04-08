from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.logging_config import trans
from app.core.logging_config import console
from app.schemas.response import SuccessResponse
from app.dto.city import CityBrief, CityCreate, CityUpdate, CityDetail
from app.models.city import City
from app.core.database import get_db


router = APIRouter()

@router.get("")
def get_cities(per_page: int = 10, page: int = 1, db: Session = Depends(get_db)):
    """
    Get all cities with pagination
    """
    # 使用数据库进行查询，且使用分页进行查询
    cities = db.query(City).limit(per_page).offset((page - 1) * per_page).all()
    total = db.query(City).count()
    page_num = total // per_page + (total % per_page > 0)
    
    # 转换为 CityDetail 格式，包含完整信息
    cities_data = [CityDetail.model_validate(city) for city in cities]
    
    # 记录日志
    console.info("Get cities with pagination", extra={"extra_data": {"count": len(cities_data), "page": page, "per_page": per_page}})
    trans.info("Get cities with pagination", extra={"extra_data": {"count": len(cities_data), "page": page, "per_page": per_page, "total": total}})
    
    return SuccessResponse(data=cities_data, total=total, page_num=page_num, cur_page=page)


@router.get("/{city_id}")
def get_city(city_id: int, db: Session = Depends(get_db)):
    """
    Get city by id
    """
    city = db.query(City).filter(City.id == city_id).first()
    if city is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"City with id {city_id} not found")

    # 转换为 CityDetail 格式
    city_data = CityDetail.model_validate(city)    
    # 记录日志
    console.info("Get city by id", extra={"extra_data": {"city_id": city_id, "city_name": city.name}})
    trans.info("Get city by id", extra={"extra_data": {"city_id": city_id, "city_name": city.name}})
    # 只返回城市详细信息，不包含分页相关字段
    return SuccessResponse(data=city_data)
        

@router.post("")
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    """
    Create a new city
    """
    # 检查城市代码是否已存在
    existing_city = db.query(City).filter(City.code == city.code).first()
    if existing_city:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail=f"City with code {city.code} already exists")
    
    # 创建城市
    new_city = City(**city.model_dump())
    db.add(new_city)
    db.commit()
    db.refresh(new_city)

    # 转换为 CityDetail 格式
    city_data = CityDetail.model_validate(new_city)
    
    # 记录日志
    console.info("Create city", extra={"extra_data": {"city_id": new_city.id, "city_name": city.name, "city_code": city.code}})
    trans.info("Create city", extra={"extra_data": {"city_id": new_city.id, "city_name": city.name, "city_code": city.code}})
    return SuccessResponse(data=city_data)


@router.put("/{city_id}")
def update_city(city_id: int, city_update: CityUpdate, db: Session = Depends(get_db)):
    """
    Update city by id
    """
    # 查找城市
    city = db.query(City).filter(City.id == city_id).first()
    if city is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"City with id {city_id} not found")
    
    # 检查城市代码是否已被其他城市使用
    if city_update.code and city_update.code != city.code:
        existing_city = db.query(City).filter(City.code == city_update.code).first()
        if existing_city:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail=f"City with code {city_update.code} already exists")
    
    # 更新城市信息
    update_data = city_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(city, field, value)
    
    db.commit()
    db.refresh(city)
    
    # 转换为 CityDetail 格式
    city_data = CityDetail.model_validate(city)
    
    # 记录日志
    console.info("Update city", extra={"extra_data": {"city_id": city_id, "city_name": city.name}})
    trans.info("Update city", extra={"extra_data": {"city_id": city_id, "city_name": city.name, "update_data": update_data}})
    return SuccessResponse(data=city_data)


@router.delete("/{city_id}")
def delete_city(city_id: int, db: Session = Depends(get_db)):
    """
    Delete city by id
    """
    city = db.query(City).filter(City.id == city_id).first()
    if city is None:
        # 返回404错误
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"City with id {city_id} not found")
    
    # 记录日志
    console.info("Delete city", extra={"extra_data": {"city_id": city_id, "city_name": city.name}})
    trans.info("Delete city", extra={"extra_data": {"city_id": city_id, "city_name": city.name}})
    
    db.delete(city)
    db.commit()
    
    return SuccessResponse(data={"message": "City deleted successfully"})