#!/usr/bin/env python3
"""Agent context checks for the pre-commit hook and CI.

AGENTS.md is the single source of agent instructions, so it must exist, its
relative links must resolve, and CLAUDE.md must not duplicate it. Skills live
under `.claude/skills/<name>/SKILL.md` with `name` and `description`
frontmatter so only the description loads until the skill is used.

Usage:
    python3 scripts/check_agents_md.py

Exit: 0 pass, 1 a check failed.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
AGENTS = ROOT / "AGENTS.md"
CLAUDE = ROOT / "CLAUDE.md"
SKILLS = ROOT / ".claude" / "skills"

LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
FENCE_RE = re.compile(r"^```.*?^```", re.MULTILINE | re.DOTALL)
FRONTMATTER_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


def check_agents_file() -> list[str]:
    if not AGENTS.is_file():
        return ["AGENTS.md is missing at the repo root"]
    return []


def check_links() -> list[str]:
    if not AGENTS.is_file():
        return []
    # Links inside fenced code blocks are examples, not references.
    body = FENCE_RE.sub("", AGENTS.read_text(encoding="utf-8"))
    errors = []
    for target in LINK_RE.findall(body):
        path = unquote(target.split("#", 1)[0])
        if not path or "://" in path or path.startswith(("#", "/", "mailto:")):
            continue
        if not (ROOT / path).exists():
            errors.append(f"AGENTS.md: relative link does not resolve: {target}")
    return errors


def check_claude() -> list[str]:
    if not CLAUDE.exists():
        return []
    if CLAUDE.read_text(encoding="utf-8").strip() != "@AGENTS.md":
        return ["CLAUDE.md must be absent or contain only `@AGENTS.md`"]
    return []


def check_skills() -> list[str]:
    errors = []
    for skill in sorted(SKILLS.glob("*/SKILL.md")):
        rel = skill.relative_to(ROOT)
        match = FRONTMATTER_RE.match(skill.read_text(encoding="utf-8"))
        if match is None:
            errors.append(f"{rel}: missing YAML frontmatter")
            continue
        fields = {}
        for line in match.group(1).splitlines():
            key, sep, value = line.partition(":")
            if sep:
                fields[key.strip()] = value.strip().strip("\"'")
        for field in ("name", "description"):
            if not fields.get(field):
                errors.append(f"{rel}: frontmatter is missing `{field}`")
    return errors


CHECKS = (
    ("agents-file", check_agents_file),
    ("links", check_links),
    ("claude", check_claude),
    ("skills", check_skills),
)


def main() -> int:
    failed = False
    for name, check in CHECKS:
        errors = check()
        if errors:
            failed = True
            print(f"  FAIL  {name}")
            for error in errors:
                print(f"        {error}")
        else:
            print(f"  ok    {name}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
