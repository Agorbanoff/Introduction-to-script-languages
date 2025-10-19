from fastapi import HTTPException

class OpenFoodFactsFetchException(HTTPException):
    def __init__(self):
        super().__init__(status_code=502, detail="Error fetching data from OpenFoodFacts")
        
class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="User not found")

class InvalidPasswordException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Incorrect password")

class RefreshTokenMismatchException(HTTPException):
    def __init__(self):
        super().__init__(status_code=401, detail="Refresh token does not match stored token")

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

class ItemNotFoundException(HTTPException):
    def __init__(self, item_name: str = "Item"):
        super().__init__(status_code=404, detail=f"{item_name} not found")


class ServerUnavailableException(HTTPException):
    def __init__(self):
        super().__init__(status_code=500, detail="Server is currently unavailable. Please try again later.")

class AIModelInferenceException(HTTPException):
    def __init__(self, detail: str = "AI model failed to generate a plan"):
        super().__init__(status_code=500, detail="Error  generating response")