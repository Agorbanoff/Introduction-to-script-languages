from fastapi import APIRouter, Depends, Header
from service.user_account_service import signUp, logIn, findUsername
from model.user_credentials_entity import UserSignUp, UserLogIn
from util.token import get_user_id_from_token

user_router = APIRouter()

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