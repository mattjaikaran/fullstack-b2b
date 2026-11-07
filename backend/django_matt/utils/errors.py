"""
Error handling middleware for django-matt.
"""

from collections.abc import Callable

from django.http import HttpRequest, HttpResponse, JsonResponse
from django_matt.core.errors import APIError


class ErrorMiddleware:
    """
    Middleware that turns APIError exceptions into JSON responses.

    Django wraps every middleware in ``convert_exception_to_response``, which
    already converts view exceptions (including ``APIError``) to 500 responses
    before ``__call__`` sees them. ``process_exception`` runs before that
    conversion, so it is the only hook that can answer with the error's own
    status code.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        return self.get_response(request)

    def process_exception(self, request: HttpRequest, exception: Exception) -> HttpResponse | None:
        if isinstance(exception, APIError):
            return JsonResponse(exception.to_dict(), status=exception.status_code)
        return None
