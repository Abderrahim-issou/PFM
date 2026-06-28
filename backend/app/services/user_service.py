from sqlalchemy.orm import Session
from app.schemas.user import User
from fastapi import HTTPException
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, create_refresh_token


# =========================
# CREATE USER (REGISTER)
# =========================
def register_user(db: Session, first_name: str, last_name: str, email: str, password: str):
    
    existing_user = db.query(User).filter(User.email == email).first();
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        );
    
    hashed_password = hash_password(password[:72]);
    
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password 
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    payload = {
        "user_id": new_user.id,
        "email": new_user.email
    };
    
    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload) 
    
    new_user.refresh_token = refresh_token;
    db.commit();
    
    return {
        "user": {
            "id": new_user.id,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "email": new_user.email,
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }





def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()





def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()





def update_user(db: Session, user_id: int, data: dict):
    user = get_user_by_id(db, user_id)

    if not user:
        return None

    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user





def delete_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)

    if not user:
        return False

    db.delete(user)
    db.commit()

    return True






def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        );

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=400,
            detail="invalid credentials"
        );

    payload = {
        "user_id": user.id,
        "email": user.email
    }
    
    access_token = create_access_token(payload);
    refresh_token = create_refresh_token(payload);
    
    user.refresh_token = refresh_token;
    db.commit();
    
    return {
         "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
        "access_token": access_token,
        "refresh_token": refresh_token
    }
    
    

def logout_user (db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="user not found"
        );
    user.refresh_token = None
    db.commit();
    
    return True;