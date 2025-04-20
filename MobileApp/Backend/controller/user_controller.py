from fastapi import APIRouter
from model.user_entity import User
from config.db_config import collection_name
from service.user_service import signUp, logIn
from schemas.schema_user import list_serial


router = APIRouter()

@router.post("/signup")
async def register_user(user: User):
    return signUp(user) 

@router.get("/login")
async def send_user(user: User):
    return logIn(user)

