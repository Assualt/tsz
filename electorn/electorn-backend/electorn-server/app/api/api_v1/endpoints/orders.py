from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.schemas.response import SuccessResponse
from app.core.logging_config import console
from app.core.logging_config import trans
from app.models.orders import Order as OrderModel
from app.schemas.orders import OrderList, Order, OrderCreate, OrderPay

import uuid
from datetime import datetime

router = APIRouter()


def generate_order_no():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    unique_id = uuid.uuid4().hex[:6].upper()
    return f"ORD{timestamp}{unique_id}"


@router.post("")
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order_no = generate_order_no()
    
    while db.query(OrderModel).filter(OrderModel.order_no == order_no).first():
        order_no = generate_order_no()
    
    order = OrderModel(
        order_no=order_no,
        train_num=order_data.train_num,
        train_date=order_data.train_date,
        train_start_time=order_data.train_start_time,
        train_end_time=order_data.train_end_time,
        from_station=order_data.from_station,
        to_station=order_data.to_station,
        seat_type=order_data.seat_type,
        passenger_name=order_data.passenger_name,
        passenger_id_card=order_data.passenger_id_card,
        passenger_count=order_data.passenger_count,
        price=order_data.price,
        status="pending",
        payment_method=order_data.payment_method
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    order_data_response = Order.model_validate(order)
    
    console.info("Create order", extra={"extra_data": {"order_no": order_no, "train_num": order_data.train_num}})
    trans.info("Create order", extra={"extra_data": {"order_no": order_no, "train_num": order_data.train_num}})
    
    return SuccessResponse(data=order_data_response)


@router.get("")
def get_order_list(per_page: int = 10, page: int = 1, db: Session = Depends(get_db)):
    orders = db.query(OrderModel).limit(per_page).offset((page - 1) * per_page).all()
    total = db.query(OrderModel).count()
    page_num = total // per_page + (total % per_page > 0)

    orders_data = [Order.model_validate(order) for order in orders]

    order_list = OrderList(
        data=orders_data,
        total=total
    )

    console.info("Get orders with pagination", extra={"extra_data": {"count": len(orders_data), "page": page, "per_page": per_page}})
    trans.info("Get orders with pagination", extra={"extra_data": {"count": len(orders_data), "page": page, "per_page": per_page, "total": total}})

    return SuccessResponse(data=order_list)


@router.get("/{order_id}")
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found")

    order_data = Order.model_validate(order)

    console.info("Get order by id", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no}})
    trans.info("Get order by id", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no}})

    return SuccessResponse(data=order_data)


@router.put("/{order_id}/pay")
def pay_order(order_id: int, pay_data: OrderPay, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found")
    
    if order.status == "paid":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order is already paid")
    
    if order.status not in ["pending"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot pay order with status: {order.status}")
    
    valid_methods = ["wechat", "alipay", "unionpay", "balance"]
    if pay_data.payment_method not in valid_methods:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid payment method: {pay_data.payment_method}")
    
    order.status = "paid"
    order.payment_method = pay_data.payment_method
    order.paid_at = datetime.now()
    
    db.commit()
    db.refresh(order)
    
    order_data = Order.model_validate(order)
    
    console.info("Pay order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no, "payment_method": pay_data.payment_method}})
    trans.info("Pay order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no, "payment_method": pay_data.payment_method}})
    
    return SuccessResponse(data=order_data)


@router.put("/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found")

    if order.status not in ["pending", "paid"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot cancel order with status: {order.status}")

    order.status = "cancelled"

    console.info("Cancel order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no, "old_status": order.status, "new_status": "cancelled"}})
    trans.info("Cancel order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no, "old_status": order.status, "new_status": "cancelled"}})

    return SuccessResponse(data={"message": "Order cancelled successfully"})


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found")

    console.info("Delete order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no}})
    trans.info("Delete order", extra={"extra_data": {"order_id": order_id, "order_no": order.order_no}})

    db.delete(order)

    return SuccessResponse(data={"message": "Order deleted successfully"})
