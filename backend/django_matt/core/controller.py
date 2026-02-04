"""
Base controller class for django-matt.

Provides a class-based approach to organizing API endpoints.
"""

from typing import Any, ClassVar


class APIController:
    """
    Base class for API controllers.

    Controllers group related endpoints together and can have
    shared configuration like tags and permissions.
    """

    tags: ClassVar[list[str]] = []
    permission_classes: ClassVar[list[Any]] = []

    def __init__(self) -> None:
        pass
