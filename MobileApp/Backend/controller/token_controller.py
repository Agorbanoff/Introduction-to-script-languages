from fastapi import APIRouter
from exceptions.exceptions import RefreshTokenMismatchException
from util.token import create_access_token, verify_refresh_token
from service.user_account_service import log_out
from service.token_service import get_refresh_token
from config.db_config import collection_name

token_router = APIRouter()

@token_router.post("/refresh")
async def generate_new_access_token(refresh_token: str):
    email = verify_refresh_token(refresh_token)

    user = await collection_name.find_one({"email": email})

    stored_token = await get_refresh_token(str(user["_id"]))

    if refresh_token != stored_token:
        await log_out(str(user["_id"]))
        raise RefreshTokenMismatchException()

    access_token = create_access_token(email)

    return {"access_token": access_token, "token_type": "bearer"}
