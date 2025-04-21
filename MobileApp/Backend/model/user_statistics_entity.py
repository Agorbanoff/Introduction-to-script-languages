from pydantic import BaseModel
from enum import Enum
from typing import Optional, List

class Gender(str, Enum):
    male = "male"
    female = "female"

class UserCredentials(BaseModel):
    gender: Optional[Gender] = None
    weight: Optional[int] = None
    height: Optional[int] = None
    age: Optional[int] = None
    bfp: Optional[float] = None