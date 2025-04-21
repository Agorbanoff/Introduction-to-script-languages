from fastapi import FastAPI
from controller.user_controller import user_router
from controller.user_statistics_controller import user_statistics_router
from exceptions.global_exception_handler import add_exception_handlers

app = FastAPI()

add_exception_handlers(app)
app.include_router(user_router)
app.include_router(user_statistics_router)
