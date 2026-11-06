"""Tests for the OpenAPI export used by frontend client generation."""

import json
from pathlib import Path

from django.conf import settings
from django.core.management import call_command

COMMITTED_SPEC = Path(settings.BASE_DIR) / "docs" / "openapi" / "openapi.json"


class TestOpenAPIExport:
    """Test the export_openapi command and the committed spec."""

    def test_export_paths_are_relative_to_api_mount(self, tmp_path):
        """Paths omit the /api mount so the frontend base URL can supply it."""
        output = tmp_path / "openapi.json"

        call_command("export_openapi", output=output)

        spec = json.loads(output.read_text())
        assert "/auth/me" in spec["paths"]
        assert "get" in spec["paths"]["/auth/me"]
        assert not any(path.startswith("/api/") for path in spec["paths"])

    def test_committed_spec_matches_api(self, tmp_path):
        """The committed fixture is regenerated whenever the API changes."""
        output = tmp_path / "openapi.json"

        call_command("export_openapi", output=output)

        assert json.loads(output.read_text()) == json.loads(COMMITTED_SPEC.read_text())
