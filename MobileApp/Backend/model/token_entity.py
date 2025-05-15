from pydantic import BaseModel

class Token(BaseModel):
    refresh_token: str