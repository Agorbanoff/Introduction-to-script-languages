from fastapi import APIRouter, Depends, Request
from model.user_statistics_entity import UserCredentials
from service.user_statistics_service import getStatistics, getBFP
from exceptions.exceptions import EmptyStatisticsException
from util.token import get_user_id_from_token

user_statistics_router = APIRouter()

@user_statistics_router.post("/statistics")
async def submit_statistics(
    request: Request,
    user_id: str = Depends(get_user_id_from_token)
):
    try:
        raw_body = await request.json()
        print("📥 RAW JSON from client:", raw_body)
        stats = UserCredentials(**raw_body)
    except Exception as e:
        print("❌ Error parsing request body:", e)
        raise

    if None in (stats.age, stats.weight, stats.height, stats.gender):
        raise EmptyStatisticsException()

    await getStatistics(
        user_id=user_id,
        age=stats.age,
        weight=stats.weight,
        height=stats.height,
        gender=stats.gender
    )

    return {"message": "Statistics saved and BFP calculated"}

@user_statistics_router.get("/statistics")
async def get_BFP(user_id: str = Depends(get_user_id_from_token)):
    result = await getBFP(user_id=user_id)
    if not result:
        raise EmptyStatisticsException()

    return {"BFP": result.get("bfp")}
