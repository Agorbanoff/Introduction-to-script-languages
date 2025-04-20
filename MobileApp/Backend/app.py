from fastapi import FastAPI
from controller.user_controller import router

app = FastAPI()

app.include_router(router)

