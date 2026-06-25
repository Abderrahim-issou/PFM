from passlib.context import CryptContext
import os
import jwt
from fastapi import HTTPException;


pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')


def hash_password(password: str) -> str:
    return pwd_context.hash(password);


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password,hashed_password);

def verify_token(token: str):

    try:
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=403,
            detail="Token expired"
    );
        
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=403,
            detail="Invalid Token"
    );
        
    