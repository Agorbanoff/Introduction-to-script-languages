from fastapi import HTTPException

class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Email not found")

class InvalidPasswordException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Incorrect password")

class EmailAlreadyUsedException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Email is already registered")
