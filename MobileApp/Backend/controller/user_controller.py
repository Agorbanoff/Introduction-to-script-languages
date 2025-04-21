from fastapi import APIRouter
from model.user_credentials_entity import User
from config.db_config import collection_name
from service.user_credentials_service import signUp, logIn
from schemas.schema_user import list_serial


router = APIRouter()

@router.post("/signup")
async def register_user(user: User):
    return await signUp(user) 

@router.post("/login")
async def send_user(user: User):
    return await logIn(user)