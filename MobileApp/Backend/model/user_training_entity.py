from pydantic import BaseModel

class UserTraining(BaseModel):
    times_a_week: int
    
