import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

# access
def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy();
    
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes);
    to_encode.update({'exp': expire})
    
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return token;


# refresh 
def create_refresh_token (data: dict): 
    to_encode = data.copy();
    
    expire = datetime.utcnow() + timedelta(days=7);
    to_encode.update({'exp': expire})
    
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token
