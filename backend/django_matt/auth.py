"""
Authentication utilities for django-matt.

Provides JWT token creation, verification, and decorators.
"""

import datetime
import functools
from collections.abc import Callable
from typing import Any

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest

User = get_user_model()

# JWT settings
JWT_SECRET = getattr(settings, "SECRET_KEY", "secret")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_LIFETIME = getattr(settings, "DJANGO_MATT_JWT", {}).get("ACCESS_TOKEN_LIFETIME", 60 * 15)
JWT_REFRESH_LIFETIME = getattr(settings, "DJANGO_MATT_JWT", {}).get(
    "REFRESH_TOKEN_LIFETIME", 60 * 60 * 24 * 7
)


def create_token_pair(user: Any) -> dict[str, str]:
    """Create access and refresh tokens for a user."""
    now = datetime.datetime.now(datetime.UTC)

    access_payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": now + datetime.timedelta(seconds=JWT_ACCESS_LIFETIME),
        "iat": now,
        "type": "access",
    }

    refresh_payload = {
        "user_id": user.id,
        "exp": now + datetime.timedelta(seconds=JWT_REFRESH_LIFETIME),
        "iat": now,
        "type": "refresh",
    }

    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def verify_token(token: str) -> dict[str, Any]:
    """Verify a JWT token and return its payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")


def refresh_access_token(refresh_token: str) -> dict[str, str]:
    """Refresh an access token using a refresh token."""
    payload = verify_token(refresh_token)

    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")

    user_id = payload.get("user_id")
    user = User.objects.get(id=user_id)

    return create_token_pair(user)


def get_user_from_request(request: HttpRequest) -> Any | None:
    """Extract user from request authorization header."""
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header[7:]

    try:
        payload = verify_token(token)
        if payload.get("type") != "access":
            return None
        user_id = payload.get("user_id")
        return User.objects.get(id=user_id)
    except (ValueError, User.DoesNotExist):
        return None


def jwt_required(func: Callable) -> Callable:
    """Decorator that requires JWT authentication."""

    @functools.wraps(func)
    async def wrapper(request, *args, **kwargs):
        user = get_user_from_request(request)
        if not user:
            from django_matt.core.errors import APIError

            raise APIError(status_code=401, message="Authentication required")
        request.user = user
        return await func(request, *args, **kwargs)

    return wrapper


def jwt_optional(func: Callable) -> Callable:
    """Decorator that optionally uses JWT authentication."""

    @functools.wraps(func)
    async def wrapper(request, *args, **kwargs):
        user = get_user_from_request(request)
        if user:
            request.user = user
        return await func(request, *args, **kwargs)

    return wrapper
