from fastapi import APIRouter, Depends, Request
from exceptions.exceptions import EmptyStatisticsException
from service.user_statistics_service import get_statistics, get_bfp
from util.token import get_user_id_from_token
from model.user_statistics_entity import Gender

user_statistics_router = APIRouter()

@user_statistics_router.post("/statistics")
async def submit_statistics(
    request: Request,
    user_id: str = Depends(get_user_id_from_token)
):
    body = await request.json()

    if not all(k in body for k in ("age", "weight", "height", "gender")):
        raise EmptyStatisticsException()

    await get_statistics(
        user_id=user_id,
        age=body["age"],
        weight=body["weight"],
        height=body["height"],
        gender=Gender(body["gender"])
    )

    return {"message": "Statistics saved successfully!"}

@user_statistics_router.get("/statistics")
async def get_BFP(user_id: str = Depends(get_user_id_from_token)):
    result = await get_bfp(user_id=user_id)
    if not result:
        raise EmptyStatisticsException()

    return {"BFP": result.get("bfp")}