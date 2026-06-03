# oss-maintainer-kit Design

## Goal

Build a lightweight open source maintainer automation kit that helps public repositories install Codex-ready maintenance workflows for PR review, issue triage, release checks, and security review.

## Selection Strategy

The project is designed around the Codex for Open Source selection signals: active OSS maintenance, PR review, issue triage, release workflows, and security work. A brand-new project cannot credibly claim wide usage immediately, so the adoption strategy is to make this tool easy to install into existing public OSS repositories and gather visible installation PRs, accepted workflows, and maintainer feedback.

## MVP Scope

The MVP is a dependency-free Node.js CLI and GitHub Action.

- `oss-maintainer-kit init` detects repository characteristics and writes maintainer workflow files.
- `oss-maintainer-kit doctor` scores a repository's maintenance readiness and reports actionable gaps.
- The GitHub Action runs the readiness checks in CI and writes a step summary.
- Generated files include `AGENTS.md`, PR template, issue template, release checklist, security profile, and a maintainer workflow example.

## Architecture

The CLI is split into focused modules:

- `src/detect.js` detects package managers, languages, CI providers, and likely test commands.
- `src/templates.js` renders deterministic maintainer workflow file contents.
- `src/init.js` plans and writes generated files without overwriting unless `--force` is passed.
- `src/doctor.js` evaluates installed maintainer readiness checks.
- `src/cli.js` parses commands and prints human-readable or JSON output.
- `src/action.js` adapts `doctor` for GitHub Actions.

No runtime dependencies are required. Tests use Node's built-in `node:test` runner.

## Data Flow

`init` reads the target repository, detects project facts, renders templates, and writes missing files. `doctor` reads the repository and returns weighted checks. The CLI formats those checks for local terminal use. The GitHub Action writes the same checks to `$GITHUB_STEP_SUMMARY`.

## Error Handling

The CLI exits with code `0` for successful command execution and code `1` for invalid commands or invalid filesystem operations. `init` skips existing files by default to avoid overwriting maintainers' local conventions. Passing `--force` explicitly replaces generated files.

## Testing

Tests cover project detection, readiness scoring, and init file planning/writing behavior. Verification uses:

```powershell
node --test
node src/cli.js doctor --json
node src/cli.js init --dry-run
```

## Adoption Evidence Plan

1. Publish the repository with a clear README and examples.
2. Add 3 to 5 installation PRs to small public OSS repositories.
3. Record accepted PRs or maintainer feedback in `docs/adoption.md`.
4. Use those visible artifacts in the Codex for Open Source application.

## Application Narrative

`oss-maintainer-kit` helps maintainers reduce repetitive review and release work by installing reusable workflows for PR risk review, issue triage, release verification, and security profiling. API credits will be used for PR diff risk analysis, issue label suggestions, release checklist generation, and security summary automation.
