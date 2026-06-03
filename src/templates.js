function renderList(values, fallback) {
  return values.length > 0 ? values.map((value) => `- ${value}`).join('\n') : `- ${fallback}`;
}

function renderAgents(project) {
  const testCommands = renderList(project.testCommands, 'Add the project-specific test command before relying on automation.');

  return `# AGENTS.md

## Maintenance workflow

This repository uses oss-maintainer-kit conventions for issue triage, pull request review, release checks, and security review.

## Branching

- Do not commit directly to the default branch.
- Use a focused work branch for each change.
- Keep pull requests small enough to review in one pass.

## Verification

Run the relevant verification commands before marking work complete:

${testCommands}

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
`;
}

function renderPullRequestTemplate(project) {
  const testCommands = renderList(project.testCommands, 'Not detected. Add the command used to verify this change.');

  return `## Summary

- 

## Risk summary

- Impact area:
- User-visible change:
- Security-sensitive code touched: yes/no

## Verification

${testCommands}

## Release impact

- Breaking change: yes/no
- Release notes needed: yes/no
`;
}

function renderIssueTemplate() {
  return `name: Bug report
description: Report a reproducible maintainer-facing issue
title: "[Bug]: "
labels: ["triage"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What happened?
    validations:
      required: true
  - type: textarea
    id: reproduce
    attributes:
      label: Reproduction steps
      description: List exact commands, inputs, and observed output.
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true
`;
}

function renderMaintainerWorkflow() {
  return `name: Maintainer Check

on:
  pull_request:
  workflow_dispatch:

jobs:
  readiness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: zptnl009-art/oss-maintainer-kit@main
`;
}

function renderReleaseChecklist() {
  return `# Release Checklist

## Before release

- Confirm CI is passing.
- Confirm release notes describe user-visible changes.
- Confirm breaking changes include migration notes.
- Confirm security-sensitive changes have reviewer sign-off.

## After release

- Verify package/artifact publication.
- Verify example installation still works.
- Open follow-up issues for deferred maintenance work.
`;
}

function renderSecurityProfile(project) {
  const languages = renderList(project.languages, 'Language not detected yet.');

  return `# Security Profile

## Project surface

Detected languages:

${languages}

## Sensitive change areas

- Authentication and authorization
- Secret handling
- Filesystem paths
- Shell command execution
- Network requests
- Dependency loading
- User-supplied parsers or templates

## Review expectations

- Add explicit threat-model notes for sensitive changes.
- Prefer small pull requests for high-risk areas.
- Treat generated workflow changes as security-relevant.
`;
}

export function buildGeneratedFiles(project) {
  return [
    { path: 'AGENTS.md', content: renderAgents(project) },
    { path: '.github/pull_request_template.md', content: renderPullRequestTemplate(project) },
    { path: '.github/ISSUE_TEMPLATE/bug_report.yml', content: renderIssueTemplate(project) },
    { path: '.github/workflows/maintainer-check.yml', content: renderMaintainerWorkflow(project) },
    { path: 'docs/release-checklist.md', content: renderReleaseChecklist(project) },
    { path: 'docs/security-profile.md', content: renderSecurityProfile(project) },
  ];
}
