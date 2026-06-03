# Contributing

Thanks for improving `oss-maintainer-kit`.

## Development setup

Requirements:

- Node.js 20 or newer
- No package install is required for the current test suite

Run verification:

```bash
node --test
node src/cli.js doctor
node src/cli.js init --dry-run
```

On Windows PowerShell, use `npm.cmd test` if `npm test` is blocked by execution policy.

## Pull request expectations

- Keep changes focused.
- Add or update tests for behavior changes.
- Update README or docs when user-facing behavior changes.
- Explain release impact and security-sensitive areas in the pull request body.

## Maintainer workflow

This repository dogfoods its own generated maintainer workflow files:

- `AGENTS.md`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/workflows/maintainer-check.yml`
- `docs/release-checklist.md`
- `docs/security-profile.md`
