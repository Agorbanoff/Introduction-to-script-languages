from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from exceptions.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    EmailAlreadyUsedException,
    InvalidTokenException,
    EmptyStatisticsException,
    StatisticsNotFoundException,
    TrainingNotFoundException,
    OpenFoodFactsFetchException,
    RefreshTokenMismatchException,
    ItemNotFoundException,
    ServerUnavailableException
)

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(UserNotFoundException)
    async def user_not_found_handler(request: Request, exc: UserNotFoundException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(InvalidPasswordException)
    async def invalid_password_handler(request: Request, exc: InvalidPasswordException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(EmailAlreadyUsedException)
    async def email_used_handler(request: Request, exc: EmailAlreadyUsedException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(InvalidTokenException)
    async def invalid_token_format_handler(request: Request, exc: InvalidTokenException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RefreshTokenMismatchException)
    async def refresh_token_mismatch_handler(request: Request, exc: RefreshTokenMismatchException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(EmptyStatisticsException)
    async def empty_stats_handler(request: Request, exc: EmptyStatisticsException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(StatisticsNotFoundException)
    async def stats_not_found_handler(request: Request, exc: StatisticsNotFoundException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(TrainingNotFoundException)
    async def training_not_found_handler(request: Request, exc: TrainingNotFoundException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(OpenFoodFactsFetchException)
    async def openfoodfacts_fetch_handler(request: Request, exc: OpenFoodFactsFetchException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(ItemNotFoundException)
    async def item_not_found_handler(request: Request, exc: ItemNotFoundException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(ServerUnavailableException)
    async def server_unavailable_handler(request: Request, exc: ServerUnavailableException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})