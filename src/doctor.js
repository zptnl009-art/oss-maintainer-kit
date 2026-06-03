import { access } from 'node:fs/promises';
import { join } from 'node:path';

import { detectProject } from './detect.js';

async function exists(root, path) {
  try {
    await access(join(root, path));
    return true;
  } catch {
    return false;
  }
}

function check(id, title, passed, weight, fix) {
  return { id, title, passed, weight, fix };
}

export async function runDoctor(root = process.cwd()) {
  const project = await detectProject(root);
  const checks = [
    check(
      'agents-guidance',
      'Repository has AGENTS.md maintainer guidance',
      await exists(root, 'AGENTS.md'),
      20,
      'Run `oss-maintainer-kit init` to generate Codex-ready maintainer instructions.',
    ),
    check(
      'pr-template',
      'Repository has a pull request template',
      await exists(root, '.github/pull_request_template.md'),
      15,
      'Add `.github/pull_request_template.md` with risk, verification, and release sections.',
    ),
    check(
      'issue-template',
      'Repository has a structured bug report template',
      await exists(root, '.github/ISSUE_TEMPLATE/bug_report.yml'),
      10,
      'Add `.github/ISSUE_TEMPLATE/bug_report.yml` to collect reproducible reports.',
    ),
    check(
      'maintainer-workflow',
      'Repository has maintainer readiness workflow',
      await exists(root, '.github/workflows/maintainer-check.yml'),
      20,
      'Add `.github/workflows/maintainer-check.yml` to run maintainer readiness checks.',
    ),
    check(
      'release-checklist',
      'Repository has a release checklist',
      await exists(root, 'docs/release-checklist.md'),
      15,
      'Add `docs/release-checklist.md` with release verification steps.',
    ),
    check(
      'security-profile',
      'Repository has a security review profile',
      await exists(root, 'docs/security-profile.md'),
      10,
      'Add `docs/security-profile.md` to define sensitive areas and review expectations.',
    ),
    check(
      'test-command',
      'Repository exposes a test command',
      project.testCommands.length > 0,
      10,
      'Add a standard test command so maintainers and automation can verify changes.',
    ),
  ];

  const totalWeight = checks.reduce((sum, item) => sum + item.weight, 0);
  const passedWeight = checks.filter((item) => item.passed).reduce((sum, item) => sum + item.weight, 0);
  const score = Math.round((passedWeight / totalWeight) * 100);

  return {
    root,
    score,
    checks,
    project,
  };
}

export function formatDoctorMarkdown(report) {
  const rows = report.checks
    .map((item) => `| ${item.passed ? '✅' : '❌'} | ${item.title} | ${item.weight} | ${item.passed ? '' : item.fix} |`)
    .join('\n');

  return `# Maintainer readiness

Score: **${report.score}/100**

| Status | Check | Weight | Fix |
| --- | --- | ---: | --- |
${rows}
`;
}
