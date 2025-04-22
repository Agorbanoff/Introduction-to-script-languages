from pydantic import BaseModel

class UserTraining(BaseModel):
    sessions_per_week: int

    
