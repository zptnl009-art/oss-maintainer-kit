import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { detectProject } from '../src/detect.js';

async function makeTempProject(name) {
  const root = join(tmpdir(), `oss-maintainer-kit-${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  return root;
}

describe('detectProject', () => {
  it('detects npm projects and a useful test command', async () => {
    const root = await makeTempProject('npm');
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test' } }));
    await writeFile(join(root, 'package-lock.json'), '{}');

    const project = await detectProject(root);

    assert.equal(project.packageManager, 'npm');
    assert.deepEqual(project.languages, ['JavaScript']);
    assert.deepEqual(project.testCommands, ['npm test']);
  });

  it('detects GitHub Actions workflows', async () => {
    const root = await makeTempProject('github-actions');
    await mkdir(join(root, '.github', 'workflows'), { recursive: true });
    await writeFile(join(root, '.github', 'workflows', 'ci.yml'), 'name: CI\n');

    const project = await detectProject(root);

    assert.deepEqual(project.ciProviders, ['GitHub Actions']);
  });
});
