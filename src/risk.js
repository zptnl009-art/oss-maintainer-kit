function normalizeFiles(files) {
  return files
    .flatMap((file) => String(file).split(','))
    .map((file) => file.trim().replaceAll('\\', '/'))
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function matchAny(file, patterns) {
  return patterns.some((pattern) => pattern.test(file));
}

const riskRules = [
  {
    area: 'GitHub Actions',
    severity: 'high',
    label: 'ci-change',
    releaseImpact: false,
    securitySensitive: true,
    patterns: [/^\.github\/workflows\//, /^action\.ya?ml$/],
    reason: 'Workflow changes can alter CI permissions, release behavior, or third-party action execution.',
    checklist: 'Review workflow permissions, event triggers, and third-party actions.',
  },
  {
    area: 'Package metadata',
    severity: 'medium',
    label: 'release-impact',
    releaseImpact: true,
    securitySensitive: false,
    patterns: [/^package\.json$/, /^package-lock\.json$/, /^pnpm-lock\.yaml$/, /^yarn\.lock$/],
    reason: 'Package metadata can affect published artifacts, dependency graph, and install behavior.',
    checklist: 'Verify package metadata, scripts, dependency changes, and publish contents.',
  },
  {
    area: 'Executable code',
    severity: 'high',
    label: 'code-change',
    releaseImpact: true,
    securitySensitive: true,
    patterns: [/^src\/.*\.(js|mjs|cjs|ts)$/],
    reason: 'Source changes can alter CLI behavior, generated files, and maintainer automation output.',
    checklist: 'Run tests and manually inspect behavior for changed commands.',
  },
  {
    area: 'Security documentation',
    severity: 'medium',
    label: 'security-review',
    releaseImpact: false,
    securitySensitive: true,
    patterns: [/^SECURITY\.md$/, /^docs\/security-profile\.md$/],
    reason: 'Security process changes affect vulnerability handling and review expectations.',
    checklist: 'Confirm reporting guidance and sensitive area definitions stay accurate.',
  },
  {
    area: 'Tests',
    severity: 'low',
    label: 'tests',
    releaseImpact: false,
    securitySensitive: false,
    patterns: [/^tests\//, /\.test\.(js|mjs|cjs|ts)$/],
    reason: 'Test changes affect verification coverage.',
    checklist: 'Confirm tests fail for the intended regression and pass with the implementation.',
  },
  {
    area: 'Documentation',
    severity: 'low',
    label: 'docs-only',
    releaseImpact: false,
    securitySensitive: false,
    patterns: [/^README\.md$/, /^CHANGELOG\.md$/, /^CONTRIBUTING\.md$/, /^docs\//],
    reason: 'Documentation changes usually do not alter runtime behavior.',
    checklist: 'Confirm documentation renders correctly and examples match current CLI behavior.',
  },
];

function severityRank(severity) {
  if (severity === 'high') {
    return 3;
  }
  if (severity === 'medium') {
    return 2;
  }
  if (severity === 'low') {
    return 1;
  }
  return 0;
}

function levelFromRank(rank) {
  if (rank >= 3) {
    return 'high';
  }
  if (rank === 2) {
    return 'medium';
  }
  return 'low';
}

export function analyzeChangedFiles(files) {
  const changedFiles = normalizeFiles(files);
  const findings = [];
  const labels = [];
  const checklist = [];
  let maxRank = changedFiles.length > 0 ? 1 : 0;
  let releaseImpact = false;
  let securitySensitive = false;

  for (const rule of riskRules) {
    const matchedFiles = changedFiles.filter((file) => matchAny(file, rule.patterns));
    if (matchedFiles.length === 0) {
      continue;
    }

    findings.push({
      area: rule.area,
      severity: rule.severity,
      reason: rule.reason,
      files: matchedFiles,
    });
    labels.push(rule.label);
    checklist.push(rule.checklist);
    maxRank = Math.max(maxRank, severityRank(rule.severity));
    releaseImpact ||= rule.releaseImpact;
    securitySensitive ||= rule.securitySensitive;
  }

  if (findings.length === 0 && changedFiles.length > 0) {
    findings.push({
      area: 'Unclassified changes',
      severity: 'medium',
      reason: 'Changed files do not match known maintainer workflow categories.',
      files: changedFiles,
    });
    labels.push('needs-review');
    checklist.push('Inspect changed files manually and decide whether tests, release notes, or security review are required.');
    maxRank = Math.max(maxRank, 2);
  }

  return {
    files: changedFiles,
    level: levelFromRank(maxRank),
    releaseImpact,
    securitySensitive,
    labels: unique(labels),
    findings,
    checklist: unique(checklist),
  };
}

export function formatRiskMarkdown(report) {
  const labels = report.labels.length > 0 ? report.labels.map((label) => `\`${label}\``).join(', ') : 'none';
  const findings = report.findings.length > 0
    ? report.findings
      .map((finding) => `- **${finding.area}** (${finding.severity}): ${finding.reason}\n  - Files: ${finding.files.join(', ')}`)
      .join('\n')
    : '- No changed files were provided.';
  const checklist = report.checklist.length > 0
    ? report.checklist.map((item) => `- ${item}`).join('\n')
    : '- Provide changed files with `--files` or the GitHub Action `changed-files` input.';

  return `# PR risk summary

Risk level: **${report.level}**
Release impact: **${report.releaseImpact ? 'yes' : 'no'}**
Security-sensitive: **${report.securitySensitive ? 'yes' : 'no'}**
Suggested labels: ${labels}

## Findings

${findings}

## Review checklist

${checklist}
`;
}
