import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { formatDoctorMarkdown, runDoctor } from '../src/doctor.js';

async function makeTempProject(name) {
  const root = join(tmpdir(), `oss-maintainer-kit-${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  return root;
}

describe('runDoctor', () => {
  it('returns a readiness score and actionable missing checks', async () => {
    const root = await makeTempProject('missing');
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test' } }));

    const report = await runDoctor(root);

    assert.equal(typeof report.score, 'number');
    assert.ok(report.score > 0);
    assert.ok(report.score < 100);
    assert.ok(report.checks.some((check) => check.id === 'pr-template' && check.passed === false));
  });

  it('scores a fully initialized repository as ready', async () => {
    const root = await makeTempProject('ready');
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test' } }));
    await mkdir(join(root, '.github', 'workflows'), { recursive: true });
    await mkdir(join(root, '.github', 'ISSUE_TEMPLATE'), { recursive: true });
    await mkdir(join(root, 'docs'), { recursive: true });
    await writeFile(join(root, 'AGENTS.md'), 'Maintenance workflow\n');
    await writeFile(join(root, '.github', 'pull_request_template.md'), 'Risk summary\n');
    await writeFile(join(root, '.github', 'ISSUE_TEMPLATE', 'bug_report.yml'), 'name: Bug report\n');
    await writeFile(join(root, '.github', 'workflows', 'maintainer-check.yml'), 'name: Maintainer Check\n');
    await writeFile(join(root, 'docs', 'release-checklist.md'), '# Release checklist\n');
    await writeFile(join(root, 'docs', 'security-profile.md'), '# Security profile\n');

    const report = await runDoctor(root);

    assert.equal(report.score, 100);
    assert.equal(report.checks.every((check) => check.passed), true);
  });

  it('formats doctor markdown with portable ASCII statuses', async () => {
    const root = await makeTempProject('markdown');
    const report = await runDoctor(root);

    const markdown = formatDoctorMarkdown(report);

    assert.match(markdown, /\| MISS \| Repository has AGENTS\.md maintainer guidance \|/);
  });
});
