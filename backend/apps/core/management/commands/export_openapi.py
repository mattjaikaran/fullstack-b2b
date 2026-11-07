"""Export the API OpenAPI schema for frontend client generation."""

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.api import api

DEFAULT_OUTPUT = Path(settings.BASE_DIR) / "docs" / "openapi" / "openapi.json"


class Command(BaseCommand):
    help = "Write the OpenAPI schema as JSON. Paths are relative to the /api mount."

    def add_arguments(self, parser):
        parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)

    def handle(self, *args, **options):
        output: Path = options["output"]
        # path_prefix="" drops the /api mount from paths; the frontend base URL supplies it.
        schema = api.get_openapi_schema(path_prefix="")
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(schema, indent=2) + "\n")
        self.stdout.write(f"Wrote OpenAPI schema to {output}")
