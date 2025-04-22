from pydantic import BaseModel, Field

class UserTraining(BaseModel):
    sessions_per_week: int = Field(..., ge=1, le=7, description="Training sessions must be between 1 and 7 per week")
