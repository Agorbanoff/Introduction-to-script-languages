from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"

class UserCredentials(BaseModel):
    gender: Gender
    weight: int
    height: int
    age: int
