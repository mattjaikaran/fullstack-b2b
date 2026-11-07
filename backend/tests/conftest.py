"""Pytest configuration and fixtures."""

import pytest

from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def user(db):
    """Create a test user."""
    return User.objects.create_user(
        email="test@example.com",
        username="testuser",
        password="testpass123",
    )


@pytest.fixture
def admin_user(db):
    """Create an admin user."""
    return User.objects.create_superuser(
        email="admin@example.com",
        username="admin",
        password="adminpass123",
    )


@pytest.fixture
def api_client(transactional_db):
    """Create an API test client.

    Async requests run their ORM calls on a different connection, so data
    created by synchronous fixtures is only visible when it is committed.
    ``transactional_db`` gives the test a committed database instead of the
    default wrapping transaction.
    """
    from django.test import AsyncClient

    return AsyncClient()


@pytest.fixture
def authenticated_client(api_client, user):
    """Create an authenticated API client."""
    from django_matt.auth import create_token_pair

    tokens = create_token_pair(user)
    # AsyncClient treats defaults as ASGI header names, so do not add the
    # WSGI-style ``HTTP_`` prefix: ASGIRequest adds it again and the view would
    # see ``HTTP_HTTP_AUTHORIZATION``.
    api_client.defaults["AUTHORIZATION"] = f"Bearer {tokens['access_token']}"
    return api_client
