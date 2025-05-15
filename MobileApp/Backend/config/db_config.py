from motor.motor_asyncio import AsyncIOMotorClient
import os

uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("❌ MONGODB_URI not set in environment variables")

client = AsyncIOMotorClient(uri)
db = client["todo_db"]

collection_name = db["Users"]
collection_statistics = db["Statistics"]
collection_training = db["Training"]
collection_token = db["Token"]