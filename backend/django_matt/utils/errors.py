"""
Error handling middleware for django-matt.
"""

import traceback
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse, JsonResponse
from django_matt.core.errors import APIError


class ErrorMiddleware:
    """
    Middleware that catches APIError exceptions and returns JSON responses.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        try:
            response = self.get_response(request)
            return response
        except APIError as e:
            return JsonResponse(e.to_dict(), status=e.status_code)
        except Exception:
            # Log the error in debug mode
            from django.conf import settings

            if settings.DEBUG:
                traceback.print_exc()
            return JsonResponse(
                {"error": "Internal server error"},
                status=500,
            )
