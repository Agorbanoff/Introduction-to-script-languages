from config.db_config import collection_training

async def TimePerWeek(user_id: str, times: int):
    await collection_training.insert_one({
        "user_id": user_id,
        "sessions_per_week": times  
    })

async def getTimePerWeek(user_id: str):
    return await collection_training.find_one({
        "user_id": user_id,
    })

