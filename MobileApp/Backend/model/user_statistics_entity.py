from pydantic import BaseModel, Field
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"

class UserCredentials(BaseModel):
    gender: Gender = Field(..., description="Gender must be either 'male' or 'female'")
    weight: int = Field(..., gt=0, lt=400, description="Weight must be a positive number under 400kg")
    height: int = Field(..., gt=50, lt=300, description="Height must be in cm (reasonable range)")
    age: int = Field(..., ge=5, le=120, description="Age must be between 5 and 120")
