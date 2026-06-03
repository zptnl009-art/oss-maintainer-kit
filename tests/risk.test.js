import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { analyzeChangedFiles, formatRiskMarkdown } from '../src/risk.js';

describe('analyzeChangedFiles', () => {
  it('classifies docs-only changes as low risk', () => {
    const report = analyzeChangedFiles(['README.md', 'docs/release-checklist.md']);

    assert.equal(report.level, 'low');
    assert.equal(report.releaseImpact, false);
    assert.equal(report.securitySensitive, false);
    assert.deepEqual(report.labels, ['docs-only']);
    assert.ok(report.checklist.some((item) => item.includes('documentation renders')));
  });

  it('flags workflows and executable source as high risk', () => {
    const report = analyzeChangedFiles(['.github/workflows/ci.yml', 'src/cli.js', 'package.json']);

    assert.equal(report.level, 'high');
    assert.equal(report.releaseImpact, true);
    assert.equal(report.securitySensitive, true);
    assert.ok(report.labels.includes('ci-change'));
    assert.ok(report.labels.includes('release-impact'));
    assert.ok(report.findings.some((finding) => finding.area === 'GitHub Actions'));
    assert.ok(report.findings.some((finding) => finding.area === 'Executable code'));
  });
});

describe('formatRiskMarkdown', () => {
  it('renders a maintainer-ready risk summary', () => {
    const report = analyzeChangedFiles(['src/doctor.js', 'SECURITY.md']);
    const markdown = formatRiskMarkdown(report);

    assert.match(markdown, /# PR risk summary/);
    assert.match(markdown, /Risk level:/);
    assert.match(markdown, /Security-sensitive:/);
  });
});
