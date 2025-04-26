from fastapi import APIRouter
from service.food_service import fetch_food_info
from exceptions.exceptions import OpenFoodFactsFetchException
from fastapi import HTTPException

food_router = APIRouter(tags=["Food"])

@food_router.get("/search")
def search_food(query: str):
    try:
        return fetch_food_info(query)
    except OpenFoodFactsFetchException:
        # returns 404 + {"detail":"Item not found"}
        raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        # returns 500 + {"detail": "...error message..."}
        raise HTTPException(status_code=500, detail=str(e))