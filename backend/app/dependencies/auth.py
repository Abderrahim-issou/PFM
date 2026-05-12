from fastapi.security import HTTPBearer;
from fastapi import Depends, HTTPException;
from app.core.security import verify_token
from app.services.user_service import get_user_by_id
from app.db.session import get_db
from sqlalchemy.orm import Session





security = HTTPBearer();

def get_current_user (credentials = Depends(security), db: Session = Depends(get_db)):
    
    token = credentials.credentials;
    if not token:
        raise HTTPException(
            status_code=403,
            detail="there is no token"
        );
    
    payload = verify_token(token);
    user = get_user_by_id(db=db, user_id=payload['user_id'])
    
    if not user:
        raise HTTPException(
        status_code=404,
        detail="User not found"
    );
        
    return user; 

def get_current_user_socket (token: str, db: Session):
    
    if not token:
        raise HTTPException(
            status_code=403,
            detail="there is no token"
        );
        
    payload = verify_token(token);
    
    
    user = get_user_by_id(db=db, user_id=payload["user_id"])
    
    if not user:
        raise HTTPException(
        status_code=404,
        detail="User not found"
    );
        
    return user;    
    