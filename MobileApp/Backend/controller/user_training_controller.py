from fastapi import APIRouter, Body, Depends, Header
from model.user_training_entity import UserTraining
from service.user_training_service import TimePerWeek, getTimePerWeek
from exceptions.exceptions import EmptyStatisticsException
from config.db_config import collection_name
from MobileApp.Backend.util.token import get_user_id_from_token

user_training_router = APIRouter()


@user_training_router.post("/training")
async def submit_training(
    training: UserTraining,
    user_id: str = Depends(get_user_id_from_token)
):
    await TimePerWeek(user_id=user_id, times=training.sessions_per_week)
    return {"message": "Training data saved"}

@user_training_router.get("/training")
async def get_training(user_id: str = Depends(get_user_id_from_token)):
    result = await getTimePerWeek(user_id=user_id)
    if not result:
        raise EmptyStatisticsException()

    return {"sessions_per_week": result.get("sessions_per_week")}