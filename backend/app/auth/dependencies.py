# app/auth/dependencies.py
# This file contains dependencies related to authentication and authorization

from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError  # JWT implementation with Python
from pydantic import ValidationError

from app.auth.models import TokenData, UserInDB
from app.auth.service import get_user
from app.core.config import settings

# Create an OAuth2 scheme for password flow authentication
# This will be used to extract the JWT token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Data to encode in the token, typically including username under 'sub' key
        expires_delta: Optional time delta for token expiration, defaults to 15 minutes

    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()  # Create a copy to avoid modifying the original dict
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))  # Set expiration time
    to_encode.update({"exp": expire})  # Add expiration time to token data
    # Encode the data using the secret key and specified algorithm
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """
    Dependency that extracts and validates the JWT token from request,
    then returns the current authenticated user.

    Args:
        token: JWT token extracted from request header using oauth2_scheme

    Returns:
        UserInDB: The authenticated user

    Raises:
        HTTPException: If token is invalid or user not found
    """
    # Prepare the exception to raise if authentication fails
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},  # Proper WWW-Authenticate header for OAuth
    )

    try:
        # Decode the JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")  # Get subject (usually username) from payload
        if username is None:
            raise credentials_exception  # No username in token
        token_data = TokenData(username=username)  # Validate username with Pydantic model
    except (JWTError, ValidationError):
        # If decoding fails or validation errors, authentication fails
        raise credentials_exception

    # Fetch user by username from database
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception  # User does not exist

    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Dependency that checks if the authenticated user is active.

    Args:
        current_user: The authenticated user from get_current_user dependency

    Returns:
        UserInDB: The active authenticated user

    Raises:
        HTTPException: If user is not active
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",  # User exists but is deactivated
        )

    return current_user