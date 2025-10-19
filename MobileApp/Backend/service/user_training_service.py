import datetime

from pymongo import ReturnDocument
from config.db_config import collection_training
from exceptions.exceptions import UserNotFoundException

async def time_per_week(user_id: str, times: int):
    await collection_training.update_one(
        {"user_id": user_id},
        {"$set": {"sessions_per_week": times}},
        upsert=True
    )

async def get_time_per_week(user_id: str):
    return await collection_training.find_one({
        "user_id": user_id,
    })

async def change_workout_plan(user_id: str, change_workout: int):
    await collection_training.update_one(
        {"user_id": user_id},
        {"$set": {"sessions_per_week": change_workout}},
        upsert=True
    )
    return change_workout

async def calculate_streak(user_id: str):
    user_data = await collection_training.find_one({"user_id": user_id})

    if not user_data:
        raise UserNotFoundException()

    times_a_week = user_data.get("sessions_per_week", 3)

    last_update = user_data.get("last_streak_update")
    now = datetime.utcnow()

    if not last_update or (now - last_update).days >= times_a_week:
        new_streak = (user_data.get("streak", 0) or 0) + 1

        updated_user = await collection_training.find_one_and_update(
            {"user_id": user_id},
            {
                "$set": {
                    "streak": new_streak,
                    "last_streak_update": now
                }
            },
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        return updated_user["streak"]

    return user_data.get("streak", 0)