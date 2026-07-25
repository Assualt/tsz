from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.response import SuccessResponse
from app.core.logging_config import console
from app.core.logging_config import trans
from app.models.passengers import Passenger as PassengerModel
from app.models.user import User as UserModel
from app.schemas.passengers import PassengerList, Passenger, PassengerCreate, PassengerUpdate
from app.api.api_v1.endpoints.auth import get_current_user


ID_CARD_TYPE_MAP = {
    '居民二代身份证': 0,
    '港澳通行证': 1,
    '台湾通行证': 2,
    '护照': 3,
    'id_card': 0,
    'hk_macau_pass': 1,
    'taiwan_pass': 2,
    'passport': 3,
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3
}

PASSENGER_TYPE_MAP = {
    '成人票': 0,
    '儿童票': 1,
    '学生票': 2,
    'adult': 0,
    'child': 1,
    'student': 2,
    0: 0,
    1: 1,
    2: 2,
    '0': 0,
    '1': 1,
    '2': 2
}


def transform_passenger_for_response(passenger_data: dict) -> dict:
    if isinstance(passenger_data, dict):
        passenger_data['id'] = str(passenger_data.get('id'))
        passenger_data['user_id'] = str(passenger_data.get('user_id'))
        
        id_card_type_val = passenger_data.get('id_card_type', 0)
        if isinstance(id_card_type_val, str):
            id_card_type_val = ID_CARD_TYPE_MAP.get(id_card_type_val, 0)
        passenger_data['id_card_type'] = int(id_card_type_val)
        
        type_val = passenger_data.get('type', 0)
        if isinstance(type_val, str):
            type_val = PASSENGER_TYPE_MAP.get(type_val, 0)
        passenger_data['type'] = int(type_val)
    return passenger_data


router = APIRouter()


@router.get("")
def get_passengers(
    per_page: int = 10,
    page: int = 1,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    passengers = db.query(PassengerModel).filter(
        PassengerModel.user_id == current_user.id
    ).limit(per_page).offset((page - 1) * per_page).all()
    
    total = db.query(PassengerModel).filter(
        PassengerModel.user_id == current_user.id
    ).count()
    page_num = total // per_page + (total % per_page > 0)

    passengers_data = [Passenger.model_validate(passenger).model_dump() for passenger in passengers]
    passengers_data = [transform_passenger_for_response(p) for p in passengers_data]

    passenger_list = {
        "data": passengers_data,
        "total": total
    }

    console.info("Get passengers for user", extra={"extra_data": {"user_id": current_user.id, "count": len(passengers_data)}})
    trans.info("Get passengers for user", extra={"extra_data": {"user_id": current_user.id, "count": len(passengers_data), "total": total}})

    return SuccessResponse(data=passenger_list)


@router.get("/{passenger_id}")
def get_passenger_by_id(
    passenger_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    passenger = db.query(PassengerModel).filter(
        PassengerModel.id == passenger_id,
        PassengerModel.user_id == current_user.id
    ).first()
    
    if not passenger:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Passenger with id {passenger_id} not found")

    passenger_data = Passenger.model_validate(passenger).model_dump()
    passenger_data = transform_passenger_for_response(passenger_data)

    console.info("Get passenger by id", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name}})
    trans.info("Get passenger by id", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name}})

    return SuccessResponse(data=passenger_data)


@router.post("")
def create_passenger(
    passenger: PassengerCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    existing_passenger = db.query(PassengerModel).filter(
        PassengerModel.user_id == current_user.id,
        PassengerModel.id_card == passenger.id_card
    ).first()
    
    if existing_passenger:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Passenger with id_card {passenger.id_card} already exists")

    passenger_data = passenger.model_dump()
    passenger_data['id_card_type'] = ID_CARD_TYPE_MAP.get(passenger.id_card_type, passenger.id_card_type)
    passenger_data['type'] = PASSENGER_TYPE_MAP.get(passenger.type, passenger.type)

    db_passenger = PassengerModel(**passenger_data, user_id=current_user.id)
    db.add(db_passenger)
    db.flush()

    console.info("Create passenger", extra={"extra_data": {"passenger_id": db_passenger.id, "passenger_name": passenger.name}})
    trans.info("Create passenger", extra={"extra_data": {"passenger_id": db_passenger.id, "passenger_name": passenger.name, "user_id": current_user.id}})

    passenger_data = Passenger.model_validate(db_passenger).model_dump()
    passenger_data = transform_passenger_for_response(passenger_data)
    return SuccessResponse(data=passenger_data)


@router.put("/{passenger_id}")
def update_passenger(
    passenger_id: int,
    passenger_update: PassengerUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    passenger = db.query(PassengerModel).filter(
        PassengerModel.id == passenger_id,
        PassengerModel.user_id == current_user.id
    ).first()
    
    if not passenger:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Passenger with id {passenger_id} not found")

    update_data = passenger_update.model_dump(exclude_unset=True)
    
    if 'id_card_type' in update_data:
        update_data['id_card_type'] = ID_CARD_TYPE_MAP.get(update_data['id_card_type'], update_data['id_card_type'])
    if 'type' in update_data:
        update_data['type'] = PASSENGER_TYPE_MAP.get(update_data['type'], update_data['type'])
    
    for field, value in update_data.items():
        setattr(passenger, field, value)

    console.info("Update passenger", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name}})
    trans.info("Update passenger", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name, "update_data": update_data}})

    passenger_data = Passenger.model_validate(passenger).model_dump()
    passenger_data = transform_passenger_for_response(passenger_data)
    return SuccessResponse(data=passenger_data)


@router.delete("/{passenger_id}")
def delete_passenger(
    passenger_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    passenger = db.query(PassengerModel).filter(
        PassengerModel.id == passenger_id,
        PassengerModel.user_id == current_user.id
    ).first()
    
    if not passenger:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Passenger with id {passenger_id} not found")

    console.info("Delete passenger", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name}})
    trans.info("Delete passenger", extra={"extra_data": {"passenger_id": passenger_id, "passenger_name": passenger.name}})

    db.delete(passenger)

    return SuccessResponse(data={"message": "Passenger deleted successfully"})