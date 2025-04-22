from fastapi import APIRouter, Depends, Header, HTTPException, Body
from service.user_credentials_service import signUp, logIn, findUsername, changeUsername, changePassword, deleteAccount
from model.user_credentials_entity import UserSignUp, UserLogIn
from config.db_config import collection_name
from jose import jwt, JWTError
import os
from exceptions.exceptions import InvalidTokenException, UserNotFoundException

user_router = APIRouter()

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


@user_router.post("/signup")
async def register_user(user: UserSignUp):
    return await signUp(user) 

@user_router.post("/login")
async def send_user(user: UserLogIn):
    return await logIn(user)

@user_router.get("/getusername")
async def get_username(user_id: str = Depends(get_user_id_from_token)):
    username = await findUsername(user_id)
    return {"username": username}