from fastapi import FastAPI
from controller.food_controller import food_router
from controller.user_account_controller import user_router
from controller.user_statistics_controller import user_statistics_router
from controller.user_training_controller import user_training_router
from controller.token_controller import token_router
from exceptions.global_exception_handler import add_exception_handlers



app = FastAPI()

add_exception_handlers(app)

app.include_router(food_router, prefix="/food")
app.include_router(user_router, prefix="/auth")
app.include_router(user_statistics_router, prefix="/stats")
app.include_router(user_training_router, prefix="/stats")
app.include_router(token_router, prefix="/auth")
