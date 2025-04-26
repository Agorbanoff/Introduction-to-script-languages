from bson import ObjectId
from config.db_config import collection_training
from exceptions.exceptions import StatisticsNotFoundException

async def TimePerWeek(user_id: str, times: int):
    await collection_training.insert_one({
        "user_id": user_id,
        "sessions_per_week": times  
    })

async def getTimePerWeek(user_id: str):
    return await collection_training.find_one({
        "user_id": user_id,
    })

async def changeWorkoutPlan(user_id: str, change_workout: int):
    times_a_week = await collection_training.find_one({"user_id": ObjectId(user_id)})
    if not times_a_week:
        raise StatisticsNotFoundException()

    await collection_training.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": {"sessions_per_week": change_workout}}
    )

    return change_workout