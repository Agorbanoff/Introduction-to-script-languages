import bcrypt
from bson import ObjectId
from util.token import create_access_token

from config.db_config import collection_name
from model.user_credentials_entity import UserSignUp, UserLogIn
from exceptions.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    EmailAlreadyUsedException
)

def hashingPassword(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verifyPassword(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


async def signUp(user: UserSignUp) -> dict:
    if await collection_name.find_one({"email": user.email}):
        raise EmailAlreadyUsedException()

    hashed_pass = hashingPassword(user.password)

    result = await collection_name.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pass
    })
    
    token = create_access_token({"sub": user.email})

    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email
        }
    }

async def logIn(user: UserLogIn) -> dict:
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
            "email": existing_user["email"]
        }
    }

async def findUsername(user_id: str):
    user = await collection_name.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise UserNotFoundException()
    return user["username"]