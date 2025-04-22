from fastapi import APIRouter, Depends, HTTPException, Header
from model.user_statistics_entity import UserCredentials
from service.user_statistics_service import getStatistics, getBFP
from exceptions.exceptions import InvalidTokenException, UserNotFoundException, EmptyStatisticsException
from config.db_config import collection_name
from jose import jwt, JWTError
import os

user_statistics_router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-dev-key")
JWT_ALGORITHM = "HS256"

async def get_user_id_from_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise InvalidTokenException()

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise InvalidTokenException()
        
        user = await collection_name.find_one({"email": email})
        if not user:
            raise UserNotFoundException()
        
        return str(user["_id"])

    except JWTError:
        raise InvalidTokenException()

@user_statistics_router.post("/statistics")
async def submit_statistics(
    stats: UserCredentials,
    user_id: str = Depends(get_user_id_from_token)
):
    if None in (stats.age, stats.weight, stats.height, stats.gender):
       raise EmptyStatisticsException()

    await getStatistics(
        user_id=user_id,
        age=stats.age,
        weight=stats.weight,
        height=stats.height,
        gender=stats.gender
    )

    return {"message": "Statistics saved and BFP calculated"}

@user_statistics_router.get("/statistics")
async def get_BFP(user_id: str = Depends(get_user_id_from_token)):
    result = await getBFP(user_id=user_id)
    if not result:
        raise EmptyStatisticsException()

    return {"BFP": result.get("bfp")}
