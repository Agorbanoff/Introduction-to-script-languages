from fastapi import HTTPException

class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="User not found")


class InvalidPasswordException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Incorrect password")


class EmailAlreadyUsedException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Email is already registered")


class InvalidTokenException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Invalid token format")


class EmptyStatisticsException(HTTPException):
    def __init__(self):
        super().__init__(status_code=400, detail="Missing required statistics fields")


class StatisticsNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="No statistics data found for this user")


class TrainingNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="No training data found for this user")
