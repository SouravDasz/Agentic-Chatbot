from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy import select
from sqlalchemy.orm import Session



from app.schemas.auth_request import RegisterRequest,LoginRequest
from app.database import get_db
from app.models.user import User
from app.core.security import hash_password,verify_password
from app.core.security import create_access_token


router=APIRouter(
    prefix="/auth",
    tags=["Authentication"]
    )


@router.post("/register",status_code=status.HTTP_201_CREATED)
def register(user_data:RegisterRequest,db:Session=Depends(get_db)):

    #check is user exist or not
    query=select(User).where(User.email==user_data.email)

    existing_user = db.execute(query).scalar_one_or_none()


    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="user alredy exist"
        )

    if user_data.password != user_data.password2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    #hash password
    hashed_password=hash_password(password=user_data.password)

    new_user=User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }

@router.post("/login",status_code=status.HTTP_200_OK)
def login(user_data:LoginRequest,db:Session=Depends(get_db)):
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="please enter following details"
        )
    #check user esixt or not
    query=select(User).where(User.email==user_data.email)
    existing_user = db.execute(query).scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )
    #match passwrod
    is_valid=verify_password(user_data.password,existing_user.hashed_password)

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token = create_access_token(
        user_id=str(existing_user.id)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": existing_user.name
    }

    