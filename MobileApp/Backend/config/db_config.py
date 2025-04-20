from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# Get MongoDB URI from Render environment variable
uri = os.getenv("MONGODB_URI")

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

db = client.todo_db
collection_name = db["Users"]
