#!/usr/bin/env node

import { planInit, writeInit } from './init.js';
import { formatDoctorMarkdown, runDoctor } from './doctor.js';
import { analyzeChangedFiles, formatRiskMarkdown } from './risk.js';

function printHelp() {
  console.log(`oss-maintainer-kit

Usage:
  oss-maintainer-kit doctor [--json] [--cwd <path>]
  oss-maintainer-kit init [--dry-run] [--force] [--cwd <path>]
  oss-maintainer-kit risk --files <paths> [--json]
  oss-maintainer-kit help

Commands:
  doctor    Score maintainer workflow readiness.
  init      Generate AGENTS.md, GitHub templates, release checklist, and security profile.
  risk      Summarize PR risk from a comma-separated changed-file list.
  help      Print this help message.
`);
}

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const options = {
    command,
    cwd: process.cwd(),
    json: false,
    dryRun: false,
    force: false,
    files: [],
  };

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--files') {
      const files = rest[index + 1];
      if (!files) {
        throw new Error('Missing value for --files');
      }
      options.files = files.split(',').map((file) => file.trim()).filter(Boolean);
      index += 1;
    } else if (arg === '--cwd') {
      const cwd = rest[index + 1];
      if (!cwd) {
        throw new Error('Missing value for --cwd');
      }
      options.cwd = cwd;
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printInitPlan(plan) {
  for (const file of plan.files) {
    console.log(`${file.status} ${file.path}`);
  }
}

function printWriteResult(result) {
  for (const path of result.created) {
    console.log(`created ${path}`);
  }
  for (const path of result.overwritten) {
    console.log(`overwrote ${path}`);
  }
  for (const path of result.skipped) {
    console.log(`skipped ${path}`);
  }
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);

  if (options.command === 'help' || options.command === '--help' || options.command === '-h') {
    printHelp();
    return;
  }

  if (options.command === 'doctor') {
    const report = await runDoctor(options.cwd);
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatDoctorMarkdown(report));
    }
    return;
  }

  if (options.command === 'init') {
    if (options.dryRun) {
      const plan = await planInit(options.cwd, { force: options.force });
      printInitPlan(plan);
    } else {
      const result = await writeInit(options.cwd, { force: options.force });
      printWriteResult(result);
    }
    return;
  }

  if (options.command === 'risk') {
    const report = analyzeChangedFiles(options.files);
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatRiskMarkdown(report));
    }
    return;
  }

  throw new Error(`Unknown command: ${options.command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
