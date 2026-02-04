"""
django-matt compatibility layer.

This module provides compatibility imports for django-matt features
using django-ninja as the underlying implementation.
"""

from ninja import NinjaAPI

# Alias for the main API class
MattAPI = NinjaAPI

__all__ = ["MattAPI"]
