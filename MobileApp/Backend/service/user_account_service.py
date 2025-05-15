import bcrypt
from bson import ObjectId
from util.token import create_access_token, create_refresh_token

from service.token_service import save_refresh_token
from config.db_config import collection_name, collection_statistics, collection_training, collection_token
from model.user_credentials_entity import UserSignUp, UserLogIn
from exceptions.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    EmailAlreadyUsedException
)

def hashing_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


async def sign_up(user: UserSignUp) -> dict:
    if await collection_name.find_one({"email": user.email}):
        raise EmailAlreadyUsedException()

    hashed_pass = hashing_password(user.password)

    result = await collection_name.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pass
    })

    email = user.email

    refresh_token = create_refresh_token(email)
    access_token = create_access_token(email)

    await save_refresh_token(refresh_token)

    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email
        }
    }

async def log_in(user: UserLogIn) -> dict:
    existing_user = await collection_name.find_one({"email": user.email})
    if not existing_user:
        raise UserNotFoundException()

    if not verify_password(user.password, existing_user["password"]):
        raise InvalidPasswordException()

    email = user.email

    refresh_token = create_refresh_token(email)
    access_token = create_access_token(email)

    await save_refresh_token(refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "email": existing_user["email"]
        }
    }

async def find_username(user_id: str):
    user = await collection_name.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise UserNotFoundException()
    return user["username"]

async def change_username(user_id: str, new_username):
       user = await collection_name.find_one({"_id": ObjectId(user_id)})
       if not user:
           raise UserNotFoundException()
       
       await collection_name.update_one(
           {"_id": ObjectId(user_id)},
            {"$set": {"username": new_username}}
       )

       return user["username"]

async def change_password(user_id: str, current_password: str, new_password: str):
    user = await collection_name.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise UserNotFoundException()

    if not verify_password(current_password, user["password"]):
        raise InvalidPasswordException()

    new_hashed_password = hashing_password(new_password)

    await collection_name.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": new_hashed_password}}
    )

    return {"message": "Password changed successfully"}

async def delete_account(user_id: str):
    stats_res = await collection_statistics.delete_many({ "user_id":user_id })
    train_res = await collection_training.delete_many({ "user_id":user_id })
    user_res  = await collection_name.delete_one({ "_id":ObjectId(user_id) })

    if user_res.deleted_count == 0:
        raise UserNotFoundException()

    return {
        "message": "Account deleted successfully",
        "deleted_statistics": stats_res.deleted_count,
        "deleted_training":   train_res.deleted_count
    }

async def log_out(user_id: str):
    await collection_token.delete_one({"_id": ObjectId(user_id)})