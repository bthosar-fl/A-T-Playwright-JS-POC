const fs = require('fs');
const path = require('path');

class HealerReport {
  constructor() {
    this.outputDir = path.resolve(__dirname, '../../ai-reports/healer');
    this.actions = [];
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  addAction(action) {
    this.actions.push({
      ...action,
      timestamp: new Date().toISOString()
    });
  }

  generate() {
    const report = {
      generatedAt: new Date().toISOString(),
      totalFailures: this.actions.length,
      healed: this.actions.filter((a) => a.status === 'healed').length,
      skipped: this.actions.filter((a) => a.status === 'skipped').length,
      manual: this.actions.filter((a) => a.status === 'manual_review').length,
      actions: this.actions
    };

    const filename = `healer-report-${Date.now()}.json`;
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[Healer] Report saved: ${filePath}`);

    // Also generate a human-readable summary
    this._writeSummary(report);

    return { report, filePath };
  }

  _writeSummary(report) {
    const lines = [
      '# Healer Report',
      `Generated: ${report.generatedAt}`,
      '',
      `| Metric | Count |`,
      `|--------|-------|`,
      `| Total Failures | ${report.totalFailures} |`,
      `| Auto-Healed | ${report.healed} |`,
      `| Skipped | ${report.skipped} |`,
      `| Needs Manual Review | ${report.manual} |`,
      ''
    ];

    for (const action of report.actions) {
      lines.push(`## ${action.failure?.step || 'Unknown Step'}`);
      lines.push(`- **Type:** ${action.failure?.type || 'unknown'}`);
      lines.push(`- **Status:** ${action.status}`);
      if (action.suggestion) {
        lines.push(`- **Suggestion:** ${action.suggestion}`);
      }
      if (action.message) {
        lines.push(`- **Details:** ${action.message}`);
      }
      lines.push('');
    }

    const summaryPath = path.join(this.outputDir, 'latest-summary.md');
    fs.writeFileSync(summaryPath, lines.join('\n'), 'utf-8');
  }
}

module.exports = HealerReport;