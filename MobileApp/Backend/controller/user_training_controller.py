from fastapi import APIRouter, Depends
from model.user_training_entity import UserTraining
from service.user_training_service import (
                                            time_per_week,
                                           change_workout_plan,
                                           get_time_per_week,
                                           calculate_streak
                                           )
from exceptions.exceptions import EmptyStatisticsException, UserNotFoundException
from util.token import get_user_id_from_token
from fastapi import Body

user_training_router = APIRouter()
@user_training_router.post("/training")
async def submit_training(
    training: UserTraining,
    user_id: str = Depends(get_user_id_from_token)
):
    await time_per_week(user_id = user_id, times = training.sessions_per_week)
    return {"message": "Training data saved"}

@user_training_router.get("/training")
async def get_training(user_id: str = Depends(get_user_id_from_token)):
    result = await get_time_per_week(user_id = user_id)
    if not result:
        raise EmptyStatisticsException()

    return {"sessions_per_week": result.get("sessions_per_week")}

@user_training_router.put("/training")
async def change_workout_plan(
    change_workout: int = Body(...),
    user_id: str = Depends(get_user_id_from_token)
):
    sessions_per_week = await change_workout_plan(user_id, change_workout)
    return {"message": "workout plan changed successfully"}

@user_training_router.post("/streak")
async def user_streak(user_id: str = Depends(get_user_id_from_token)):
    streak = await calculate_streak(user_id)
    if not streak:
        raise UserNotFoundException
    
    return {"message": streak.get("streak")}