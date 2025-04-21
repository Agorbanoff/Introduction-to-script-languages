from pydantic import BaseModel

class UserSignUp(BaseModel):
    username: str
    email: str
    password: str

class UserLogIn(BaseModel):
    email: str
    password: str
