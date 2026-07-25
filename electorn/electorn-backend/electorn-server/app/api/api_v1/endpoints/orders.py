from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.response import SuccessResponse
from app.core.logging_config import console
from app.core.logging_config import trans
from app.models.orders import Order as OrderModel
from app.schemas.orders import OrderList, Order


router = APIRouter()


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