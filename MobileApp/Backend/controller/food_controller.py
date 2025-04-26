from fastapi import APIRouter
from service.food_service import fetch_food_info

food_router = APIRouter(prefix="/food", tags=["Food"])

@food_router.get("/search")
async def search_food(query: str):
    result = await fetch_food_info(query)
    return result
