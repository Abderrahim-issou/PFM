from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.user_service import login_user, logout_user, register_user
from app.schemas.route_schemas import RegisterSchema, Loginschema, Logoutschema
from app.schemas.route_schemas import UserProfileResponse, UserProfileUpdate
from app.services.user_service import update_user, delete_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import User
from app.dependencies.auth import get_current_user







router = APIRouter();


@router.post('/auth/login')
def login(
    data: Loginschema, 
    response: Response,
    db: Session = Depends(get_db)
):
    result = login_user(db, data.email, data.password);
    
    if not result:
        return {"message": "Invalid credentials"}
    
    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        samesite="lax"
    )
    
    return {
        "access_token": result['access_token'],
        "user": result['user']       
    }

@router.post("/auth/register")
def register(
    data: RegisterSchema,
    response: Response, 
    db: Session = Depends(get_db)
): 
    result = register_user(db=db,  first_name=data.first_name, last_name=data.last_name, email=data.email, password=data.password)
    if not result:
        return {"message": "Invalid credentials"}

    response.set_cookie(
        key="refresh_token",
        value=result['refresh_token'],
        httponly=True,
        samesite="lax"
    );
    return {
        "access_token": result["access_token"],
        "user": result['user']
    }

@router.post('/auth/logout')
def logout(
    data: Logoutschema, 
    response: Response,
    db: Session = Depends(get_db)): 
    result = logout_user(user_id=data.user_id, db=db);
    if not result:
        return {"message": "something went wrong during logout"}
    response.delete_cookie(key="refresh_token");
    return result;



@router.get("/auth/me", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch("/auth/me", response_model=UserProfileResponse)
def update_my_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = payload.model_dump(exclude_unset=True)

    user = update_user(
        db=db,
        user_id=current_user.id,
        data=update_data,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.delete("/auth/me")
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_user(
        db=db,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "message": "User account deleted successfully"
    }