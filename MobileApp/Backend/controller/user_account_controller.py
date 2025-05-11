from fastapi import APIRouter, Body, Depends, Header
from service.user_account_service import sign_up, log_in, find_username, change_username, change_password, delete_account
from model.user_credentials_entity import UserSignUp, UserLogIn
from util.token import get_user_id_from_token

user_router = APIRouter()

@user_router.post("/signup")
async def register_user(user: UserSignUp):
    return await sign_up(user)

@user_router.post("/login")
async def send_user(user: UserLogIn):
    return await log_in(user)

@user_router.get("/getusername")
async def get_username(user_id: str = Depends(get_user_id_from_token)):
    username = await find_username(user_id)
    return {"username": username}

@user_router.put("/changeusername")
async def change_username(
    new_username: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    username = await change_username(user_id, new_username)
    return {"message": "Username updated successfully", "new_username": username}

@user_router.put("/changepassword")
async def change_password(
    current_password: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    result = await change_password(user_id, current_password, new_password)
    return result

@user_router.delete("/deleteaccount")
async def delete_account(user_id: str = Depends(get_user_id_from_token)):
    return await delete_account(user_id)