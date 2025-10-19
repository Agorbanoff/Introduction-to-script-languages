from datetime import datetime, timedelta
from typing import Dict, Any
from fastapi import Header
from jose import jwt, JWTError
from exceptions.exceptions import InvalidTokenException, UserNotFoundException
from config.db_config import collection_name
import os

JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-dev-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = int(timedelta(minutes=15).total_seconds())
REFRESH_EXPIRE_SECONDS = int(timedelta(days=30).total_seconds())

def create_token(email: str, expires_delta: int, token_type: str = "access") -> str:
    to_encode = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(seconds=expires_delta),
        "type": token_type,
        "iat": datetime.utcnow()
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(email: str, expire_delta: int = REFRESH_EXPIRE_SECONDS) -> str:
    return create_token(email, expire_delta, "refresh")

def create_access_token(email: str, expires_delta: int = JWT_EXPIRE_SECONDS) -> str:
    return create_token(email, expires_delta, "access")

def verify_token(token: str, expected_type: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        if payload.get("type") != expected_type:
            raise InvalidTokenException()

        if not payload.get("sub"):
            raise InvalidTokenException()

        return payload
    except JWTError:
        raise InvalidTokenException()

def verify_refresh_token(refresh_token: str) -> str:
    payload = verify_token(refresh_token, "refresh")
    return payload["sub"]

def extract_token(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise InvalidTokenException()
    return authorization.split(" ")[1]

async def get_user_from_token(authorization: str = Header(...), token_type="access") -> dict:
    token = extract_token(authorization)
    payload = verify_token(token, token_type)

    user = await collection_name.find_one({"email": payload["sub"]})
    if not user:
        raise UserNotFoundException()

    return user

async def get_user_id_from_token(authorization: str = Header(...)) -> str:
    user = await get_user_from_token(authorization)
    return str(user["_id"])

async def get_user_email_from_token(authorization: str = Header(...)) -> str:
    user = await get_user_from_token(authorization)
    return user["email"]