from fastapi import APIRouter, Depends, HTTPException, status # Import necessary modules from FastAPI
from fastapi.security import OAuth2PasswordRequestForm # Import OAuth2PasswordRequestForm for handling login data
from datetime import timedelta # Import timedelta for setting token expiration time
from typing import Dict # Import Dict for specifying the type of the response

# Define a constant for access token expiration time in minutes
from .dependencies import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES # Import functions for token creation and expiration time

# Create an API router for authentication endpoints, with prefix '/api/auth' and tag 'Authentication'
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Mock user database (in real application, this would be replaced by a database connection)
fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Administrator",
        "email": "admin@example.com",
        "hashed_password": "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB.",  # "password" -  In a real application, use a secure password hashing library.
        "disabled": False,
        "roles": ["admin"]
    },
    "user": {
        "username": "user",
        "full_name": "Normal User",
        "email": "user@example.com",
        "hashed_password": "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB.",  # "password" - In a real application, use a secure password hashing library.
        "disabled": False,
        "roles": ["user"]
    }
}

# Function to verify password (in a real app, use a proper password hashing library)
def verify_password(plain_password, hashed_password):
    # This is a placeholder for a secure password verification.  Do not use this in production.
    return hashed_password == "$2b$12$Bpd0ZiG2kpuJmEt6QJLXEuvpfAlg1poUCYqLhONzCyDEqeShHSIB."

# Function to retrieve a user from the mock database
def get_user(db, username: str):
    # Check if username exists in the database
    if username in db:
        # Return user details if found
        user_dict = db[username]
        return user_dict
    # Return None if username is not found
    return None

# Function to authenticate a user against the mock database
def authenticate_user(fake_db, username: str, password: str):
    # Retrieve user from database
    user = get_user(fake_db, username)
    # Check if user exists
    if not user:
        return False
    # Verify password using the placeholder verification function
    if not verify_password(password, user["hashed_password"]):
        return False
    # Return user if authentication is successful
    return user

# API endpoint for obtaining an access token
@router.post("/token", response_model=Dict[str, str])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Endpoint to authenticate user and generate an access token.
    """
    # Authenticate user using credentials provided in the form data.
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    # Raise HTTPException if authentication fails.
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Generate access token with expiration time.
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "roles": user["roles"]},
        expires_delta=access_token_expires
    )
    # Return access token and token type.
    return {"access_token": access_token, "token_type": "bearer"}