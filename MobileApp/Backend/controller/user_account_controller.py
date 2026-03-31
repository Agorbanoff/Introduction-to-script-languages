from fastapi import APIRouter, Body, Depends
from model.user_credentials_entity import UserSignUp, UserLogIn
from util.token import get_user_id_from_token
from service.user_account_service import (sign_up,
                                          log_in,
                                          find_username,
                                          change_username as change_username_service,
                                          change_password as change_password_service,
                                          delete_account as delete_account_service,
                                          log_out as log_out_service)
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
    current_password: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    username = await change_username_service(user_id, new_username, current_password)
    return {"message": "Username updated successfully", "new_username": username}
@user_router.put("/changepassword")
async def change_password(
    current_password: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    result = await change_password_service(user_id, current_password, new_password)
    return result
@user_router.delete("/deleteaccount")
async def delete_account(user_id: str = Depends(get_user_id_from_token)):
    return await delete_account_service(user_id)
@user_router.post("/logout")
async def log_out(user_id: str = Depends(get_user_id_from_token)):
    return await log_out_service(user_id)
