from model.user_statistics_entity import UserCredentials
from config.db_config import collection_statistics

async def getStatistics(user_id: str):
    await collection_statistics.insert_one({
        "user_id": user_id,
        "age": None,
        "weight": None,
        "height": None,
        "gender": None
    })