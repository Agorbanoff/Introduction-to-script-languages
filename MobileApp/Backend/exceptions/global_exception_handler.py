from fastapi import Request
from fastapi.responses import JSONResponse
from exceptions.exceptions import UserNotFoundException, InvalidPasswordException, EmailAlreadyUsedException

def add_exception_handlers(app):
    @app.exception_handler(UserNotFoundException)
    async def user_not_found_handler(request: Request, exc: UserNotFoundException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(InvalidPasswordException)
    async def invalid_password_handler(request: Request, exc: InvalidPasswordException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(EmailAlreadyUsedException)
    async def email_used_handler(request: Request, exc: EmailAlreadyUsedException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
