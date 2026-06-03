import { appendFile } from 'node:fs/promises';

import { formatDoctorMarkdown, runDoctor } from './doctor.js';
import { analyzeChangedFiles, formatRiskMarkdown } from './risk.js';

async function run() {
  const root = process.env.GITHUB_WORKSPACE || process.cwd();
  const report = await runDoctor(root);
  const markdown = formatDoctorMarkdown(report);

  console.log(`Maintainer readiness score: ${report.score}/100`);
  for (const check of report.checks) {
    console.log(`${check.passed ? 'PASS' : 'MISS'} ${check.id}: ${check.title}`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    let summary = `${markdown}\n`;
    if (process.env.INPUT_CHANGED_FILES) {
      const riskReport = analyzeChangedFiles(process.env.INPUT_CHANGED_FILES.split(','));
      summary += `\n${formatRiskMarkdown(riskReport)}\n`;
      console.log(`PR risk level: ${riskReport.level}`);
    }
    await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
