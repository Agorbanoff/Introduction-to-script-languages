from fastapi import FastAPI
from controller.user_controller import router
from exceptions.global_exception_handler import add_exception_handlers

app = FastAPI()

add_exception_handlers(app)
app.include_router(router)
