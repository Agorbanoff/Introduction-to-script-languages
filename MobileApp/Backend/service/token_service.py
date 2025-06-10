from datetime import datetime, timedelta
from typing import Dict, Any
from bson import ObjectId

from util.token import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token, get_user_id_from_token,
)
from exceptions.exceptions import InvalidTokenException, UserNotFoundException
from config.db_config import collection_name, collection_token


REFRESH_EXPIRE_SECONDS = 30 * 24 * 60 * 60


async def save_refresh_token(email: str) -> Dict[str, Any]:
    user = await collection_name.find_one({"email": email})
    if not user:
        raise UserNotFoundException()

    user_id = str(user["_id"])

    access_token = create_access_token(email)
    refresh_token = create_refresh_token(email)

    now = datetime.utcnow()
    expires_at = now + timedelta(seconds=REFRESH_EXPIRE_SECONDS)

    await collection_token.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "refresh_token": refresh_token,
                "created_at": now,
                "last_used": now,
                "expires_at": expires_at
            }
        },
        upsert=True
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


async def get_refresh_token(user_id: str) -> str:
    token_doc = await collection_token.find_one({"_id": ObjectId(user_id)})
    if not token_doc or not token_doc.get("refresh_token"):
        raise InvalidTokenException()

    if token_doc.get("expires_at") and token_doc["expires_at"] < datetime.utcnow():
        raise InvalidTokenException()

    await collection_token.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"last_used": datetime.utcnow()}}
    )

    return token_doc["refresh_token"]


async def get_new_token(user_id: str) -> Dict[str, Any]:
    try:
        stored_refresh_token = await get_refresh_token(user_id)
        email = verify_refresh_token(stored_refresh_token)

        user = await collection_name.find_one({"_id": ObjectId(user_id)})
        if not user or user["email"] != email:
            raise InvalidTokenException()

        new_access_token = create_access_token(email)

        return {
            "access_token": new_access_token,
            "token_type": "Bearer"
        }

    except Exception as e:
        raise InvalidTokenException() from e

async def delete_refresh_token(user_id: str) -> str:
    result = await collection_token.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise InvalidTokenException()
    return "Token deleted successfully!"