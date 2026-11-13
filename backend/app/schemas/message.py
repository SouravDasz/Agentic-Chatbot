from pydantic import BaseModel,ConfigDict
from datetime import datetime



class MessageRequest(BaseModel):
    message: str



class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)