import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { planInit, writeInit } from '../src/init.js';

async function makeTempProject(name) {
  const root = join(tmpdir(), `oss-maintainer-kit-${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  return root;
}

describe('init workflow', () => {
  it('plans maintainer files without overwriting existing files by default', async () => {
    const root = await makeTempProject('plan');
    await writeFile(join(root, 'AGENTS.md'), 'existing instructions\n');

    const plan = await planInit(root);
    const agents = plan.files.find((file) => file.path === 'AGENTS.md');

    assert.equal(agents.status, 'skip');
    assert.ok(plan.files.some((file) => file.path === '.github/pull_request_template.md'));
    assert.ok(plan.files.some((file) => file.path === 'docs/release-checklist.md'));
  });

  it('writes generated maintainer files', async () => {
    const root = await makeTempProject('write');

    const result = await writeInit(root);
    const agents = await readFile(join(root, 'AGENTS.md'), 'utf8');
    const prTemplate = await readFile(join(root, '.github', 'pull_request_template.md'), 'utf8');

    assert.ok(result.created.includes('AGENTS.md'));
    assert.match(agents, /Maintenance workflow/);
    assert.match(prTemplate, /Risk summary/);
  });
});
