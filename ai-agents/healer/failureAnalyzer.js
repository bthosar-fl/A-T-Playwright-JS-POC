const fs = require('fs');
const path = require('path');

const FAILURE_TYPES = {
  LOCATOR: 'locator',
  TIMEOUT: 'timeout',
  STEP_MISMATCH: 'step_mismatch',
  NAVIGATION: 'navigation',
  ASSERTION: 'assertion',
  UNKNOWN: 'unknown'
};

class FailureAnalyzer {
  constructor(reportsDir) {
    this.reportsDir = reportsDir || path.resolve(__dirname, '../../reports');
  }

  analyzeReport(reportPath) {
    const reportFile = reportPath || path.join(this.reportsDir, 'cucumber-report.json');
    if (!fs.existsSync(reportFile)) {
      throw new Error(`Report not found: ${reportFile}`);
    }

    const report = JSON.parse(fs.readFileSync(reportFile, 'utf-8'));
    return this._extractFailures(report);
  }

  _extractFailures(report) {
    const failures = [];

    for (const feature of report) {
      for (const element of feature.elements || []) {
        for (const step of element.steps || []) {
          if (step.result && step.result.status === 'failed') {
            failures.push({
              feature: feature.name,
              scenario: element.name,
              step: step.name || step.keyword,
              keyword: step.keyword?.trim(),
              location: step.match?.location,
              errorMessage: step.result.error_message || '',
              duration: step.result.duration,
              type: this._classifyFailure(step.result.error_message || '')
            });
          }
        }
      }
    }

    return failures;
  }

  _classifyFailure(errorMessage) {
    const msg = errorMessage.toLowerCase();

    if (msg.includes('locator') || msg.includes('selector') ||
        msg.includes('no element') || msg.includes('not found')) {
      return FAILURE_TYPES.LOCATOR;
    }
    if (msg.includes('timeout') || msg.includes('timed out') ||
        msg.includes('waiting for')) {
      return FAILURE_TYPES.TIMEOUT;
    }
    if (msg.includes('undefined') || msg.includes('ambiguous') ||
        msg.includes('step definition')) {
      return FAILURE_TYPES.STEP_MISMATCH;
    }
    if (msg.includes('navigation') || msg.includes('net::') ||
        msg.includes('navigating') || msg.includes('url')) {
      return FAILURE_TYPES.NAVIGATION;
    }
    if (msg.includes('expect') || msg.includes('assert') ||
        msg.includes('expected') || msg.includes('tobe')) {
      return FAILURE_TYPES.ASSERTION;
    }

    return FAILURE_TYPES.UNKNOWN;
  }

  getSummary(failures) {
    const summary = { total: failures.length, byType: {} };
    for (const f of failures) {
      summary.byType[f.type] = (summary.byType[f.type] || 0) + 1;
    }
    return summary;
  }
}

module.exports = { FailureAnalyzer, FAILURE_TYPES };