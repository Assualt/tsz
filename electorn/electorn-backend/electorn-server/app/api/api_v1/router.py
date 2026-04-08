from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, tickets, cities, stations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(cities.router, prefix="/cities", tags=["cities"])
api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
