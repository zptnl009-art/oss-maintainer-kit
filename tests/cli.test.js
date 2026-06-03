import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function makeTempProject(name) {
  const root = join(tmpdir(), `oss-maintainer-kit-${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  return root;
}

describe('CLI', () => {
  it('prints doctor JSON for a target repository', async () => {
    const root = await makeTempProject('cli-doctor');
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test' } }));

    const { stdout } = await execFileAsync(process.execPath, ['src/cli.js', 'doctor', '--json', '--cwd', root]);
    const report = JSON.parse(stdout);

    assert.equal(typeof report.score, 'number');
    assert.ok(Array.isArray(report.checks));
  });

  it('prints an init dry-run plan without writing files', async () => {
    const root = await makeTempProject('cli-init');

    const { stdout } = await execFileAsync(process.execPath, ['src/cli.js', 'init', '--dry-run', '--cwd', root]);

    assert.match(stdout, /create AGENTS\.md/);
    assert.match(stdout, /create \.github\/pull_request_template\.md/);
  });
});
