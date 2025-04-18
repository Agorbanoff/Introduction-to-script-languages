from fastapi import APIRouter
from model.user_entity import User
from config.db_config import collection_name
from schemas.schema_user import list_serial
router = APIRouter()

@router.get("/")
async def get_user():
    user = list_serial(collection_name.find())
    return user 

@router.post("/")
async def send_user(todo: User):
    collection_name.insert_one(dict(todo))

@router.delete("/")
async def delete_user(todo: User):
    collection_name.delete_one(dict(todo))