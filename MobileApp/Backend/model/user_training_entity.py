from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class Exercise(BaseModel):
    name: str
    sets: Optional[int] = None
    reps: Optional[int] = None

class WorkoutDay(BaseModel):
    day: str
    exercises: List[Exercise]

class UserTraining(BaseModel):
    plan_raw: Optional[str]
    plan_json: Optional[List[WorkoutDay]]

class Sessions(BaseModel):
    sessions_per_week: int = Field(..., ge=1, le=7)
    streak: Optional[int]
    last_streak_update: Optional[datetime]