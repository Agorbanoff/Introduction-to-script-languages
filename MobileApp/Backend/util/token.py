from datetime import datetime, timedelta
from fastapi import Header
from jose import jwt, JWTError
from exceptions.exceptions import InvalidTokenException, UserNotFoundException
from config.db_config import collection_name
import os

#creating a token
JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-dev-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = int(timedelta(days=30).total_seconds())


def create_access_token(email: str, expires_delta: int = JWT_EXPIRE_SECONDS) -> str:
    to_encode = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(seconds=expires_delta)
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)



#validating the token
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
