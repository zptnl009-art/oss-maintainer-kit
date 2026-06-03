import { access, readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return undefined;
  }
}

async function hasFiles(path) {
  try {
    const info = await stat(path);
    if (!info.isDirectory()) {
      return false;
    }
    const entries = await readdir(path);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export async function detectProject(root = process.cwd()) {
  const packageJsonPath = join(root, 'package.json');
  const packageJson = await readJson(packageJsonPath);
  const hasPackageJson = Boolean(packageJson);
  const hasPnpmLock = await exists(join(root, 'pnpm-lock.yaml'));
  const hasYarnLock = await exists(join(root, 'yarn.lock'));
  const hasPackageLock = await exists(join(root, 'package-lock.json'));
  const hasPyproject = await exists(join(root, 'pyproject.toml'));
  const hasRequirements = await exists(join(root, 'requirements.txt'));
  const hasCargo = await exists(join(root, 'Cargo.toml'));
  const hasGoMod = await exists(join(root, 'go.mod'));
  const hasTsconfig = await exists(join(root, 'tsconfig.json'));
  const hasGithubActions = await hasFiles(join(root, '.github', 'workflows'));
  const hasGitlab = await exists(join(root, '.gitlab-ci.yml'));
  const hasCircle = await exists(join(root, '.circleci', 'config.yml'));

  let packageManager;
  if (hasPnpmLock) {
    packageManager = 'pnpm';
  } else if (hasYarnLock) {
    packageManager = 'yarn';
  } else if (hasPackageLock || hasPackageJson) {
    packageManager = 'npm';
  } else if (hasPyproject || hasRequirements) {
    packageManager = 'python';
  } else if (hasCargo) {
    packageManager = 'cargo';
  } else if (hasGoMod) {
    packageManager = 'go';
  }

  const languages = unique([
    hasPackageJson ? 'JavaScript' : undefined,
    hasTsconfig ? 'TypeScript' : undefined,
    hasPyproject || hasRequirements ? 'Python' : undefined,
    hasCargo ? 'Rust' : undefined,
    hasGoMod ? 'Go' : undefined,
  ]);

  const ciProviders = unique([
    hasGithubActions ? 'GitHub Actions' : undefined,
    hasGitlab ? 'GitLab CI' : undefined,
    hasCircle ? 'CircleCI' : undefined,
  ]);

  const testCommands = [];
  if (hasPackageJson && packageJson?.scripts?.test) {
    if (packageManager === 'pnpm') {
      testCommands.push('pnpm test');
    } else if (packageManager === 'yarn') {
      testCommands.push('yarn test');
    } else {
      testCommands.push('npm test');
    }
  }
  if ((hasPyproject || hasRequirements) && testCommands.length === 0) {
    testCommands.push('pytest');
  }
  if (hasCargo) {
    testCommands.push('cargo test');
  }
  if (hasGoMod) {
    testCommands.push('go test ./...');
  }

  return {
    root,
    packageManager,
    languages,
    ciProviders,
    testCommands: unique(testCommands),
    files: {
      packageJson: hasPackageJson,
      githubActions: hasGithubActions,
      pyproject: hasPyproject,
      requirements: hasRequirements,
      cargo: hasCargo,
      goMod: hasGoMod,
    },
  };
}
