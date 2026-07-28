const path = require('path');
const { FailureAnalyzer, FAILURE_TYPES } = require('./failureAnalyzer');
const LocatorHealer = require('./locatorHealer');
const StepHealer = require('./stepHealer');
const ScreenshotAnalyzer = require('./screenshotAnalyzer');
const HealerReport = require('./healerReport');

class HealerAgent {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.failureAnalyzer = new FailureAnalyzer(options.reportsDir);
    this.locatorHealer = new LocatorHealer();
    this.stepHealer = new StepHealer();
    this.screenshotAnalyzer = new ScreenshotAnalyzer();
    this.report = new HealerReport();
  }

  async healFromReport(reportPath) {
    console.log(`[Healer] Analyzing failures${this.dryRun ? ' (DRY RUN)' : ''}...`);

    const failures = this.failureAnalyzer.analyzeReport(reportPath);
    const summary = this.failureAnalyzer.getSummary(failures);
    console.log(`[Healer] Found ${summary.total} failure(s):`, summary.byType);

    if (failures.length === 0) {
      console.log('[Healer] No failures to heal');
      return { healed: 0, failures: [] };
    }

    for (const failure of failures) {
      await this._healFailure(failure);
    }

    const { report: finalReport, filePath } = this.report.generate();
    console.log(`[Healer] Healing complete. Healed: ${finalReport.healed}, Manual: ${finalReport.manual}`);
    return finalReport;
  }

  async _healFailure(failure) {
    console.log(`[Healer] Processing: ${failure.step} (${failure.type})`);

    let result = null;

    switch (failure.type) {
      case FAILURE_TYPES.LOCATOR:
      case FAILURE_TYPES.TIMEOUT:
        result = this.locatorHealer.heal(failure);
        if (result) {
          const applied = this.locatorHealer.applyFix(result, this.dryRun);
          this.report.addAction({
            failure,
            status: applied ? 'healed' : 'skipped',
            suggestion: result.suggestion,
            message: applied ? `Replaced locator in ${result.file}` : 'Could not apply fix'
          });
        } else {
          const screenshot = this.screenshotAnalyzer.analyze(failure);
          this.report.addAction({
            failure,
            status: 'manual_review',
            screenshot: screenshot.available ? screenshot.screenshots[0] : null,
            message: 'Could not determine alternative locator'
          });
        }
        break;

      case FAILURE_TYPES.STEP_MISMATCH:
        result = this.stepHealer.heal(failure);
        if (result) {
          this.report.addAction({
            failure,
            status: result.action === 'create_step_def' ? 'manual_review' : 'healed',
            suggestion: result.suggestion || result.stub,
            message: result.message
          });
        }
        break;

      case FAILURE_TYPES.ASSERTION:
        this.report.addAction({
          failure,
          status: 'manual_review',
          message: 'Assertion failures require manual review (business logic)'
        });
        break;

      default:
        this.report.addAction({
          failure,
          status: 'skipped',
          message: `Unhandled failure type: ${failure.type}`
        });
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reportArg = args.find((a) => a.startsWith('--report='));
  const reportPath = reportArg ? path.resolve(reportArg.split('=')[1]) : undefined;

  const agent = new HealerAgent({ dryRun });

  agent.healFromReport(reportPath).then((result) => {
    console.log('\n--- Healer Summary ---');
    console.log(`Total: ${result.totalFailures || 0}, Healed: ${result.healed || 0}, Manual: ${result.manual || 0}`);
  }).catch((err) => {
    console.error('[Healer] Error:', err.message);
    process.exit(1);
  });
}

module.exports = HealerAgent;