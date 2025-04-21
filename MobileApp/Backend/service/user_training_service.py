from config.db_config import collection_training

async def trainingInfo(user_id: str):
    await collection_training.insert_one({
        "user_id": user_id,
        "BFP": None,
        "times_a_week": None
    })