from fastapi import FastAPI
from config.db_config import client
from controller.user_controller import router

app = FastAPI()

app.include_router(router)

