from fastapi import APIRouter, Body, Depends, Header
from service.user_account_service import signUp, logIn, findUsername, changeUsername, changePassword, deleteAccount
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

@user_router.put("/changeusername")
async def change_username(
    new_username: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    username = await changeUsername(user_id, new_username)
    return {"message": "Username updated successfully", "new_username": username}

@user_router.put("/changepassword")
async def change_password(
    current_password: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    user_id: str = Depends(get_user_id_from_token)
):
    result = await changePassword(user_id, current_password, new_password)
    return result

@user_router.delete("/deleteaccount")
async def delete_account(user_id: str = Depends(get_user_id_from_token)):
    return await deleteAccount(user_id)