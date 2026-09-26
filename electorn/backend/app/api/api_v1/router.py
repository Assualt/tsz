from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, tickets, cities, stations, static, orders, passengers, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(cities.router, prefix="/cities", tags=["cities"])
api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
api_router.include_router(static.router, prefix="/static", tags=["static"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(passengers.router, prefix="/passengers", tags=["passengers"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
