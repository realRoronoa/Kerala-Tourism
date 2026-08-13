from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database.connection import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency that decodes the JWT token and fetches the current authenticated user.
    """
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    stmt = select(User).where(User.id == int(user_id))
    user = db.scalar(stmt)
    return user


def get_current_admin(
    current_user: Optional[User] = Depends(get_current_user)
) -> User:
    """
    Dependency that enforces the authenticated user holds NATPAC Admin privileges.
    Raises HTTP 401 if unauthenticated or HTTP 403 if user lacks admin role.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if current_user.role not in ["natpac_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only NATPAC Administrators can access this resource."
        )
    return current_user


__all__ = ["get_db", "get_current_user", "get_current_admin"]

