from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class UserTraining(BaseModel):
    sessions_per_week: int = Field(..., ge=1, le=7, description="Training sessions must be between 1 and 7 per week")
    streak: int = Field(..., ge=0, description="Weeks that have been spent in training by user")
    last_streak_update: Optional[datetime] = Field(
    default=None,
    description="Last time when streak was updated"
)