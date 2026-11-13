from pwdlib import PasswordHash
import jwt
from datetime import timezone,timedelta,datetime


from app.core.config import settings

password_hash=PasswordHash.recommended()


def hash_password(password:str)->str:
    return password_hash.hash(password)


#return True or False if two password match
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password
    )


#create jwt token
def create_access_token(user_id:str)->str:
    now=datetime.now(timezone.utc)

    expire=now+timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": user_id,
        "iat": now,
        "exp": expire
    }
    # Generate token
    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return token



def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"require": ["exp", "sub", "iat"]}
        )

        user_id = payload.get("sub")

        if not isinstance(user_id, str) or not user_id:
            return None

        return user_id

    except jwt.InvalidTokenError:
        return None
