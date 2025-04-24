from fastapi import APIRouter, Depends
from model.user_statistics_entity import UserCredentials
from service.user_statistics_service import getStatistics, getBFP
from exceptions.exceptions import EmptyStatisticsException
from util.token import get_user_id_from_token

user_statistics_router = APIRouter()

@user_statistics_router.post("/statistics")
async def submit_statistics(
    stats: UserCredentials,
    user_id: str = Depends(get_user_id_from_token)
):
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
