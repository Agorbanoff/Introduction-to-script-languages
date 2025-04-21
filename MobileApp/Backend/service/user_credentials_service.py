import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from service.user_statistics_service import getStatistics
from service.user_training_service import trainingInfo
import os

from config.db_config import collection_name
from model.user_credentials_entity import User
from exceptions.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    EmailAlreadyUsedException
)
JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-dev-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = int(os.getenv("JWT_EXPIRE_SECONDS", 3600))


def hashingPassword(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verifyPassword(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(data: dict, expires_delta: int = JWT_EXPIRE_SECONDS) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def signUp(user: User) -> dict:
    if await collection_name.find_one({"email": user.email}):
        raise EmailAlreadyUsedException()

    hashed_pass = hashingPassword(user.password)

    result = await collection_name.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pass
    })

    user_id = str(result.inserted_id)
    await getStatistics(user_id)
    await trainingInfo(user_id)
    
    token = create_access_token({"sub": user.email})

    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": user.username,
            "email": user.email
        }
    }

async def logIn(user: User) -> dict:
    existing_user = await collection_name.find_one({"email": user.email})
    if not existing_user:
        raise UserNotFoundException()

    if not verifyPassword(user.password, existing_user["password"]):
        raise InvalidPasswordException()

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "username": existing_user["username"],
            "email": existing_user["email"]
        }
    }

async def logOut():
    pass

async def deleteAccount():
    pass

async def findUsername():
    pass