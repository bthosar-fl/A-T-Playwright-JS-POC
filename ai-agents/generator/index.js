const fs = require('fs');
const path = require('path');
const FeatureGenerator = require('./featureGenerator');
const StepDefGenerator = require('./stepDefGenerator');
const PageObjectMapper = require('./pageObjectMapper');

class GeneratorAgent {
  constructor(options = {}) {
    this.outputDir = path.resolve(__dirname, 'output');
    this.featureGenerator = new FeatureGenerator(options.featuresDir);
    this.stepDefGenerator = new StepDefGenerator();
    this.pageObjectMapper = new PageObjectMapper();

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateFromPlan(planFile) {
    console.log(`[Generator] Reading plan: ${planFile}`);
    const featureContent = fs.readFileSync(planFile, 'utf-8');
    return this.generateFromGherkin(featureContent);
  }

  async generateFromGherkin(gherkinContent) {
    console.log('[Generator] Generating test artifacts...');

    // Parse the feature data from gherkin text
    const featureData = this._parseGherkin(gherkinContent);

    // Generate the feature file
    const featurePath = this.featureGenerator.writeFeatureFile(
      featureData,
      this._toFilename(featureData.name)
    );

    // Generate step definitions for new steps
    const stepDefContent = this.stepDefGenerator.generateFromFeature(gherkinContent);
    let stepDefPath = null;
    if (stepDefContent) {
      const stepDefName = this._toFilename(featureData.name).replace('.feature', 'Steps.js');
      stepDefPath = this.stepDefGenerator.writeStepDefFile(stepDefContent, stepDefName);
    }

    // Check which page object methods are needed
    const mappingReport = this._checkPageObjectCoverage(featureData);

    // Save generation report
    const report = {
      timestamp: new Date().toISOString(),
      featureFile: featurePath,
      stepDefFile: stepDefPath,
      pageObjectCoverage: mappingReport
    };
    const reportPath = path.join(this.outputDir, 'generation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[Generator] Report saved: ${reportPath}`);

    return report;
  }

  _parseGherkin(content) {
    const lines = content.split('\n');
    const featureMatch = lines.find((l) => l.trim().startsWith('Feature:'));
    const name = featureMatch ? featureMatch.replace(/^\s*Feature:\s*/, '') : 'Unknown Feature';

    const scenarios = [];
    let currentScenario = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Scenario:')) {
        if (currentScenario) scenarios.push(currentScenario);
        currentScenario = { name: trimmed.replace('Scenario:', '').trim(), steps: [] };
      } else if (trimmed.match(/^(Given|When|Then|And|But)\s/)) {
        if (currentScenario) currentScenario.steps.push(trimmed);
      }
    }
    if (currentScenario) scenarios.push(currentScenario);

    return { name, scenarios };
  }

  _checkPageObjectCoverage(featureData) {
    const allSteps = featureData.scenarios.flatMap((s) => s.steps);
    const coverage = [];

    for (const step of allSteps) {
      const mapped = this.pageObjectMapper.findMethodForStep(step);
      coverage.push({
        step,
        mapped: mapped ? `${mapped.className}.${mapped.method.name}` : null,
        needsImplementation: !mapped
      });
    }
    return coverage;
  }

  _toFilename(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.feature';
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const agent = new GeneratorAgent();

  if (args[0] === '--plan' && args[1]) {
    const planFile = path.resolve(args[1]);
    agent.generateFromPlan(planFile).then((report) => {
      console.log('\n--- Generation Complete ---');
      console.log(JSON.stringify(report, null, 2));
    }).catch((err) => {
      console.error('[Generator] Error:', err.message);
      process.exit(1);
    });
  } else if (args[0] === '--feature' && args[1]) {
    const featureFile = path.resolve(args[1]);
    const content = fs.readFileSync(featureFile, 'utf-8');
    agent.generateFromGherkin(content).then((report) => {
      console.log('\n--- Generation Complete ---');
      console.log(JSON.stringify(report, null, 2));
    }).catch((err) => {
      console.error('[Generator] Error:', err.message);
      process.exit(1);
    });
  } else {
    console.log('Usage:');
    console.log('  node ai-agents/generator/index.js --plan ai-agents/planner/output/HCMAT-123.feature');
    console.log('  node ai-agents/generator/index.js --feature features/myTest.feature');
  }
}

module.exports = GeneratorAgent;