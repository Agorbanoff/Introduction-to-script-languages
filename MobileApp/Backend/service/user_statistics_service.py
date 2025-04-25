from config.db_config import collection_statistics

async def getStatistics(user_id: str, age: int, weight: int, height: int, gender: str):
    gender_int = 1 if gender == "male" else 0
    BFP = await calculateBFP(user_id, weight, height, age, gender_int)

    await collection_statistics.insert_one({
        "user_id": user_id,
        "age": age,
        "weight": weight,
        "height": height,
        "gender": gender,
        "bfp": BFP
    })

async def  getBFP(user_id: str):
    return await collection_statistics.find_one({
        "user_id": user_id,
    })

async def calculateBFP(user_id: str, weight: int, height: int, age: int, gender: int):

    BMI = weight / ((height / 100) ** 2)
    BFP = 1.2 * BMI + 0.23 * age - 10.8 * gender - 5.4
    return round(BFP, 1)

