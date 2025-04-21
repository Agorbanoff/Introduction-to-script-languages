from pydantic import BaseModel

class UserTraining(BaseModel):
    BFP: int
    times_a_week: int
    
