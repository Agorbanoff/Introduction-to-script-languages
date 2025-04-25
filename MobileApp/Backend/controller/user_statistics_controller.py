from fastapi import APIRouter, Depends, Request
from exceptions.exceptions import EmptyStatisticsException
from service.user_statistics_service import getStatistics, getBFP
from util.token import get_user_id_from_token
from model.user_statistics_entity import Gender  # ✅ добавяш това!

user_statistics_router = APIRouter()

@user_statistics_router.post("/statistics")
async def debug_submit_statistics(
    request: Request,
    user_id: str = Depends(get_user_id_from_token)
):
    try:
        print("🔐 Headers:", request.headers)
        body = await request.json()
        print("🔥 RAW BODY:", body)

        if not all(k in body for k in ("age", "weight", "height", "gender")):
            raise EmptyStatisticsException()

        await getStatistics(
            user_id=user_id,
            age=body["age"],
            weight=body["weight"],
            height=body["height"],
            gender=Gender(body["gender"])
        )

        return {"message": "Statistics saved successfully!"}

    except Exception as e:
        print("❌ Error in /statistics:", e)
        raise
