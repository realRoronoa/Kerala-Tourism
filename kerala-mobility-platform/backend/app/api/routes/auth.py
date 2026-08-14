from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.api.deps import get_db, get_current_user, get_current_admin
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    verify_firebase_id_token
)
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin, FirebaseLoginRequest

router = APIRouter()


@router.post("/firebase-login", response_model=Token)
def firebase_login(payload: FirebaseLoginRequest, db: Session = Depends(get_db)):
    """
    Accepts Firebase ID token from mobile (React Native),
    verifies via Firebase Admin SDK, auto-provisions user in PostgreSQL as role='user', and issues session token.
    """
    decoded = verify_firebase_id_token(payload.id_token)
    if not decoded or "uid" not in decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token."
        )

    email = decoded.get("email") or f"{decoded['uid']}@firebase.user"
    full_name = decoded.get("name") or "Firebase Traveler"

    stmt = select(User).where(User.email == email)
    user = db.scalar(stmt)

    if not user:
        user = User(
            email=email,
            hashed_password=get_password_hash(decoded["uid"]),
            full_name=full_name,
            role="user",
            device_token_hash=decoded["uid"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new traveler user. 
    Role is strictly hardcoded to 'user' to prevent privilege escalation via public signups.
    """
    stmt = select(User).where(User.email == payload.email)
    existing_user = db.scalar(stmt)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/user-login", response_model=Token)
def login_traveler(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Login endpoint for mobile traveler users (email or mobile number + password).
    """
    query_str = payload.email.strip()
    stmt = select(User).where(
        (User.email == query_str) |
        (User.mobile_number == query_str) |
        (User.email == f"{query_str}@keralamobility.in")
    )
    user = db.scalar(stmt)

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile number or password."
        )

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 compatible token login endpoint specifically for the NATPAC Admin Web Dashboard.
    Enforces that only accounts holding 'natpac_admin' role can log in.
    """
    stmt = select(User).where(User.email == form_data.username)
    user = db.scalar(stmt)
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.role not in ["natpac_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only NATPAC Administrators can access the Web Dashboard."
        )

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns profile information for the currently authenticated user.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return current_user


@router.post("/promote-admin/{user_id}", response_model=UserResponse)
def promote_user_to_admin(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    """
    Promotes an existing user to NATPAC Administrator.
    Strictly restricted to existing authenticated NATPAC Administrators.
    """
    stmt = select(User).where(User.id == user_id)
    target_user = db.scalar(stmt)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    target_user.role = "natpac_admin"
    db.commit()
    db.refresh(target_user)
    return target_user

