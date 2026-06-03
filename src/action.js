import { appendFile } from 'node:fs/promises';

import { formatDoctorMarkdown, runDoctor } from './doctor.js';

async function run() {
  const root = process.env.GITHUB_WORKSPACE || process.cwd();
  const report = await runDoctor(root);
  const markdown = formatDoctorMarkdown(report);

  console.log(`Maintainer readiness score: ${report.score}/100`);
  for (const check of report.checks) {
    console.log(`${check.passed ? 'PASS' : 'MISS'} ${check.id}: ${check.title}`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`, 'utf8');
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
