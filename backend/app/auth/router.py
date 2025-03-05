
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Dict
from .dependencies import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Mock user database
fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Administrator",
        "email": "admin@example.com",
        "hashed_password": "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB.",  # "password"
        "disabled": False,
        "roles": ["admin"]
    },
    "user": {
        "username": "user",
        "full_name": "Normal User",
        "email": "user@example.com",
        "hashed_password": "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB.",  # "password"
        "disabled": False,
        "roles": ["user"]
    }
}

def verify_password(plain_password, hashed_password):
    # In a real app, you would use proper password hashing
    # For this demo, we'll just check if the hashed password matches
    return hashed_password == "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB."

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return user_dict
    return None

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

@router.post("/token", response_model=Dict[str, str])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "roles": user["roles"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
