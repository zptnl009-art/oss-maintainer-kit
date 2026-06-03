# oss-maintainer-kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free Node.js CLI and GitHub Action that installs and verifies OSS maintainer automation workflows.

**Architecture:** The project uses small ESM modules with clear boundaries: detection, template rendering, init file writing, readiness scoring, CLI parsing, and GitHub Action output. Templates are deterministic strings so tests can verify generated paths and behavior without network access.

**Tech Stack:** Node.js 24 locally, GitHub Actions `node20`, built-in `node:test`, no runtime dependencies.

---

## File Structure

- `package.json`: package metadata, bin entry, scripts.
- `README.md`: project purpose, quickstart, adoption plan, application positioning.
- `LICENSE`: MIT license.
- `.gitignore`: Node/project ignores.
- `.github/workflows/ci.yml`: test workflow for this repository.
- `action.yml`: reusable GitHub Action metadata.
- `src/detect.js`: repository detection.
- `src/templates.js`: generated file templates.
- `src/init.js`: dry-run and write logic.
- `src/doctor.js`: readiness checks and score calculation.
- `src/cli.js`: command-line interface.
- `src/action.js`: GitHub Action adapter.
- `tests/detect.test.js`: detection tests.
- `tests/init.test.js`: init planning/writing tests.
- `tests/doctor.test.js`: readiness scoring tests.
- `docs/superpowers/specs/2026-06-03-oss-maintainer-kit-design.md`: product design.
- `docs/adoption.md`: external OSS adoption tracker.

## Task 1: Red Tests

**Files:**
- Create: `tests/detect.test.js`
- Create: `tests/init.test.js`
- Create: `tests/doctor.test.js`

- [ ] **Step 1: Write failing tests**

Tests import modules that do not exist yet and define the expected public API.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test`

Expected: FAIL with module-not-found errors for `src/detect.js`, `src/init.js`, and `src/doctor.js`.

## Task 2: Core Modules

**Files:**
- Create: `src/detect.js`
- Create: `src/templates.js`
- Create: `src/init.js`
- Create: `src/doctor.js`

- [ ] **Step 1: Implement detection**

`detectProject(root)` returns package manager, language, CI, and test command facts based on files present in `root`.

- [ ] **Step 2: Implement templates**

`buildGeneratedFiles(root, project)` returns generated file descriptors for maintainer workflow files.

- [ ] **Step 3: Implement init writer**

`planInit(root, options)` reports files to create, skip, or overwrite. `writeInit(root, options)` writes planned files.

- [ ] **Step 4: Implement doctor checks**

`runDoctor(root)` returns weighted checks and a readiness score.

- [ ] **Step 5: Run tests to verify GREEN**

Run: `node --test`

Expected: PASS.

## Task 3: CLI and Action

**Files:**
- Create: `src/cli.js`
- Create: `src/action.js`
- Create: `action.yml`
- Create: `package.json`

- [ ] **Step 1: Implement CLI commands**

Support `help`, `init`, and `doctor` with `--dry-run`, `--force`, and `--json`.

- [ ] **Step 2: Implement GitHub Action adapter**

Run doctor checks and append Markdown output to `$GITHUB_STEP_SUMMARY` when present.

- [ ] **Step 3: Verify CLI behavior**

Run: `node src/cli.js doctor --json`

Expected: JSON output with `score` and `checks`.

## Task 4: Documentation and CI

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `.gitignore`
- Create: `.github/workflows/ci.yml`
- Create: `docs/adoption.md`

- [ ] **Step 1: Document maintainer value**

Explain why the project exists, what it generates, and how it supports OSS maintenance.

- [ ] **Step 2: Add CI**

Run tests on pull requests and pushes to `main`.

- [ ] **Step 3: Add adoption tracker**

Document the external repository adoption plan and evidence fields.

## Task 5: Verification and Release Prep

**Files:**
- Modify: all created files as needed.

- [ ] **Step 1: Run unit tests**

Run: `node --test`

Expected: all tests pass.

- [ ] **Step 2: Run CLI smoke tests**

Run:

```powershell
node src/cli.js doctor --json
node src/cli.js init --dry-run
```

Expected: commands exit successfully and print readiness/init output.

- [ ] **Step 3: Review Git status**

Run: `git status --short --branch`

Expected: only intentional project files are staged or unstaged.
