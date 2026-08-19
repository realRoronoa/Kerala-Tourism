import time
import random
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
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
from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    Token, 
    UserLogin, 
    FirebaseLoginRequest,
    SendOTPRequest,
    VerifyOTPRequest,
    OTPResponse,
    UserProfileUpdate
)
from app.services.email_service import email_service

router = APIRouter()

# In-memory OTP cache: { identifier: {"otp": "123456", "expires_at": float, "name": str} }
OTP_STORE: Dict[str, Dict[str, Any]] = {}


@router.post("/send-otp", response_model=OTPResponse)
def send_otp(payload: SendOTPRequest, background_tasks: BackgroundTasks):
    """
    Generates a secure 6-digit OTP and dispatches via Email or SMS.
    Returns delivery confirmation and dev OTP preview for testing.
    """
    raw_id = payload.identifier.strip()
    if not raw_id:
        raise HTTPException(status_code=400, detail="Mobile number or email is required.")

    # Generate 6-digit OTP
    otp_code = f"{random.randint(100000, 999999)}"
    # Pre-determined demo code for testing if required
    if raw_id in ["9876543210", "demo@keralamobility.in"]:
        otp_code = "123456"

    expires_at = time.time() + 600  # 10 minutes TTL
    OTP_STORE[raw_id] = {
        "otp": otp_code,
        "expires_at": expires_at,
        "name": payload.full_name or "Traveler"
    }

    is_email = "@" in raw_id
    delivery_channel = "email" if is_email else "sms"

    if is_email:
        background_tasks.add_task(email_service.send_otp_email, raw_id, otp_code, payload.full_name)
    else:
        # For SMS, log to server console
        print(f"📲 [SMS OTP DISPATCH] Code '{otp_code}' sent to Mobile: +91 {raw_id}")

    return {
        "message": f"Verification OTP dispatched via {delivery_channel}.",
        "identifier": raw_id,
        "delivery_channel": delivery_channel,
        "dev_otp_preview": otp_code  # Helpful for instant testing in mockathon
    }


@router.post("/verify-otp", response_model=Token)
def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies the submitted 6-digit OTP, auto-creates/fetches traveler profile,
    and returns an authenticated JWT access token.
    """
    raw_id = payload.identifier.strip()
    submitted_otp = payload.otp.strip()

    stored = OTP_STORE.get(raw_id)
    
    # Allow 123456 as universal fallback for easy demoing
    is_valid = (
        (stored and stored["otp"] == submitted_otp and time.time() <= stored["expires_at"]) or
        submitted_otp == "123456"
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code. Please request a fresh one."
        )

    # Determine user email / mobile
    is_email = "@" in raw_id
    email = raw_id if is_email else f"{raw_id}@keralamobility.in"
    mobile = raw_id if not is_email else None
    full_name = payload.full_name or (stored.get("name") if stored else "Exploro Traveler")

    stmt = select(User).where((User.email == email) | (User.mobile_number == raw_id))
    user = db.scalar(stmt)

    if not user:
        user = User(
            email=email,
            hashed_password=get_password_hash("traveler_otp_login"),
            full_name=full_name,
            mobile_number=mobile,
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Clear OTP from store
    if raw_id in OTP_STORE:
        del OTP_STORE[raw_id]

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }


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
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Registers a new traveler user and dispatches a welcome email.
    """
    stmt = select(User).where(User.email == payload.email)
    existing_user = db.scalar(stmt)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    pwd = payload.password or "123456"
    user = User(
        email=payload.email,
        hashed_password=get_password_hash(pwd),
        full_name=payload.full_name or "Exploro Traveler",
        mobile_number=payload.mobile_number,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Dispatch welcome email asynchronously
    if "@" in user.email:
        background_tasks.add_task(email_service.send_welcome_email, user.email, user.full_name)

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
    return {"access_token": access_token, "token_type": "bearer", "user": user}


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
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns profile information for the currently authenticated user.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    payload: UserProfileUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Updates profile information for the currently authenticated user.
    """
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.mobile_number is not None:
        current_user.mobile_number = payload.mobile_number
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/promote-admin/{user_id}", response_model=UserResponse)
def promote_user_to_admin(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    """
    Promotes an existing user to NATPAC Administrator.
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
