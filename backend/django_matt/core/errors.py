"""
Error classes for django-matt.

Provides standardized API error handling.
"""

from typing import Any


class APIError(Exception):
    """Base API error that can be raised in endpoints."""

    def __init__(
        self,
        message: str = "An error occurred",
        status_code: int = 400,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

    def to_dict(self) -> dict[str, Any]:
        """Convert error to dictionary for JSON response."""
        result = {
            "error": self.message,
            "status_code": self.status_code,
        }
        if self.details:
            result["details"] = self.details
        return result


class NotFoundAPIError(APIError):
    """Error for when a resource is not found."""

    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message=message, status_code=404)


class ValidationAPIError(APIError):
    """Error for validation failures."""

    def __init__(
        self, message: str = "Validation error", details: dict[str, Any] | None = None
    ) -> None:
        super().__init__(message=message, status_code=422, details=details)


class UnauthorizedAPIError(APIError):
    """Error for unauthorized access."""

    def __init__(self, message: str = "Unauthorized") -> None:
        super().__init__(message=message, status_code=401)


class ForbiddenAPIError(APIError):
    """Error for forbidden access."""

    def __init__(self, message: str = "Forbidden") -> None:
        super().__init__(message=message, status_code=403)
