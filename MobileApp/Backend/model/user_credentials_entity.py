from pydantic import BaseModel, EmailStr, Field

class UserSignUp(BaseModel):
    username: str = Field(..., min_length=2, max_length=30, description="Username must be between 2 and 30 characters")
    email: EmailStr = Field(..., description="Valid email address is required")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class UserLogIn(BaseModel):
    email: EmailStr = Field(..., description="Valid email address is required")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")
