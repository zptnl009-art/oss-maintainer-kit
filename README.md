# oss-maintainer-kit

`oss-maintainer-kit` installs lightweight maintainer workflows for open source repositories. It helps maintainers standardize PR review, issue triage, release verification, and security review without adding runtime dependencies.

The project is intentionally small: a Node.js CLI, deterministic templates, a readiness checker, and a reusable GitHub Action.

## Why this exists

Maintainers repeat the same operational work across repositories:

- asking contributors for reproducible issue details
- checking whether pull requests include tests and release notes
- identifying security-sensitive changes
- keeping release checklists consistent
- documenting repo-specific instructions for coding agents and contributors

`oss-maintainer-kit` turns those conventions into files that can be installed, reviewed, and adapted in public repositories.

## Quickstart

Run a dry-run plan:

```bash
npx oss-maintainer-kit init --dry-run
```

Install maintainer files:

```bash
npx oss-maintainer-kit init
```

Check maintainer readiness:

```bash
npx oss-maintainer-kit doctor
```

For local development from this repository:

```bash
node src/cli.js init --dry-run
node src/cli.js doctor
node --test
```

## Generated files

`oss-maintainer-kit init` creates these files when they are missing:

- `AGENTS.md`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/workflows/maintainer-check.yml`
- `docs/release-checklist.md`
- `docs/security-profile.md`

Existing files are skipped by default. Use `--force` only when you intentionally want to replace them.

## GitHub Action

After this repository is public, another repository can run the readiness checker with:

```yaml
name: Maintainer Check

on:
  pull_request:
  workflow_dispatch:

jobs:
  readiness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: zptnl009-art/oss-maintainer-kit@main
```

The action writes a maintainer readiness score and checklist to the GitHub Actions step summary.

## Codex for Open Source positioning

This project is built to support visible OSS maintenance work:

- PR review: generated PR templates and risk summaries
- issue triage: structured issue templates
- release workflows: release checklist and readiness checks
- security workflows: security profile and sensitive-change review guidance
- maintainer automation: CLI and GitHub Action installation path

The adoption target is to install this kit into 3 to 5 public repositories and document the resulting PRs or maintainer feedback in `docs/adoption.md`.

## Development

```bash
node --test
node src/cli.js doctor --json
node src/cli.js init --dry-run
```

No dependencies are required beyond Node.js 20 or newer.

## Project docs

- `CONTRIBUTING.md`: contributor workflow
- `SECURITY.md`: vulnerability reporting and sensitive areas
- `docs/adoption.md`: external OSS adoption tracker
- `docs/application.md`: Codex for Open Source application draft
- `docs/release-checklist.md`: release workflow
- `docs/security-profile.md`: generated security review profile

## License

MIT
