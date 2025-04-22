from fastapi import APIRouter, Body, Depends, Header
from model.user_training_entity import UserTraining
from service.user_training_service import TimePerWeek, getTimePerWeek
from exceptions.exceptions import InvalidTokenException, UserNotFoundException, EmptyStatisticsException
from config.db_config import collection_name
from jose import jwt, JWTError
import os

user_training_router = APIRouter()

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