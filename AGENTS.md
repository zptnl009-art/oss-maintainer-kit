# AGENTS.md

## Maintenance workflow

This repository uses oss-maintainer-kit conventions for issue triage, pull request review, release checks, and security review.

## Branching

- Do not commit directly to the default branch.
- Use a focused work branch for each change.
- Keep pull requests small enough to review in one pass.

## Verification

Run the relevant verification commands before marking work complete:

- npm test

## Pull request review

- Summarize user-visible behavior changes.
- Identify risk areas and files that need careful review.
- Confirm tests, documentation, and release notes are updated when needed.

## Release readiness

- Check semantic version impact.
- Confirm changelog or release notes are updated.
- Confirm migration notes exist for breaking changes.

## Security review

- Flag changes touching authentication, authorization, parsing, file paths, network calls, secrets, or dependency loading.
- Prefer explicit threat-model notes for high-risk changes.
