from config.db_config import collection_statistics
from model.user_statistics_entity import Gender

async def get_statistics(user_id: str, age: int, weight: int, height: int, gender: Gender):
    gender_int = 1 if gender == Gender.male else 0  
    bfp = await calculate_bfp(user_id, weight, height, age, gender_int)

    await collection_statistics.insert_one({
        "user_id": user_id,
        "age": age,
        "weight": weight,
        "height": height,
        "gender": gender.value, 
        "bfp": bfp
    })


async def get_bfp(user_id: str):
    return await collection_statistics.find_one({
        "user_id": user_id,
    })

async def calculate_bfp(user_id: str, weight: int, height: int, age: int, gender: int):

    bmi = weight / ((height / 100) ** 2)
    bfp = 1.2 * bmi + 0.23 * age - 10.8 * gender - 5.4
    return round(bfp, 1)