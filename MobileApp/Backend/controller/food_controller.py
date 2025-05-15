from fastapi import APIRouter
from service.food_service import fetch_food_info
from exceptions.exceptions import OpenFoodFactsFetchException
from exceptions.exceptions import ItemNotFoundException, ServerUnavailableException

food_router = APIRouter()

@food_router.get("/search")
def search_food(query: str):
    try:
        return fetch_food_info(query)
    except OpenFoodFactsFetchException:
        raise ItemNotFoundException()
    except Exception as e:
        raise ServerUnavailableException()