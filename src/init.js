import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { detectProject } from './detect.js';
import { buildGeneratedFiles } from './templates.js';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function planInit(root = process.cwd(), options = {}) {
  const project = await detectProject(root);
  const generatedFiles = buildGeneratedFiles(project);
  const files = [];

  for (const file of generatedFiles) {
    const absolutePath = join(root, file.path);
    const alreadyExists = await exists(absolutePath);
    const status = alreadyExists ? (options.force ? 'overwrite' : 'skip') : 'create';
    files.push({ ...file, status });
  }

  return { root, project, files };
}

export async function writeInit(root = process.cwd(), options = {}) {
  const plan = await planInit(root, options);
  const result = {
    created: [],
    overwritten: [],
    skipped: [],
    files: plan.files,
  };

  if (options.dryRun) {
    return result;
  }

  for (const file of plan.files) {
    if (file.status === 'skip') {
      result.skipped.push(file.path);
      continue;
    }

    const absolutePath = join(root, file.path);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.content, 'utf8');

    if (file.status === 'overwrite') {
      result.overwritten.push(file.path);
    } else {
      result.created.push(file.path);
    }
  }

  return result;
}
