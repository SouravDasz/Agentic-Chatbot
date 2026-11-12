from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    password2: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email:EmailStr
    password:str=Field(min_length=8)