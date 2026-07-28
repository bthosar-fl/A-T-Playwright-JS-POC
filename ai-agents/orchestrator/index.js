const path = require('path');
const fs = require('fs');
const PlannerAgent = require('../planner');
const GeneratorAgent = require('../generator');
const HealerAgent = require('../healer');

class Orchestrator {
  constructor(options = {}) {
    this.steps = options.steps || ['plan', 'generate', 'heal'];
    this.dryRun = options.dryRun || false;
    this.storyKey = options.storyKey || null;
    this.localStory = options.localStory || null;
  }

  async run() {
    console.log('='.repeat(50));
    console.log('[Orchestrator] AI Test Pipeline Starting');
    console.log(`[Orchestrator] Steps: ${this.steps.join(' → ')}`);
    console.log('='.repeat(50));

    const results = {};

    for (const step of this.steps) {
      try {
        switch (step) {
          case 'plan':
            results.plan = await this._runPlanner();
            break;
          case 'generate':
            results.generate = await this._runGenerator(results.plan);
            break;
          case 'heal':
            results.heal = await this._runHealer();
            break;
          default:
            console.warn(`[Orchestrator] Unknown step: ${step}`);
        }
      } catch (err) {
        console.error(`[Orchestrator] Step "${step}" failed: ${err.message}`);
        results[step] = { error: err.message };
        break;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('[Orchestrator] Pipeline Complete');
    console.log('='.repeat(50));
    return results;
  }

  async _runPlanner() {
    console.log('\n--- Step: PLAN ---');
    const planner = new PlannerAgent();

    if (this.localStory) {
      const storyData = JSON.parse(fs.readFileSync(path.resolve(this.localStory), 'utf-8'));
      return planner.planFromLocal(storyData);
    }
    if (this.storyKey) {
      return planner.planFromStory(this.storyKey);
    }
    return planner.planFromSprint();
  }

  async _runGenerator(planResult) {
    console.log('\n--- Step: GENERATE ---');
    const generator = new GeneratorAgent();

    if (planResult && planResult.outputFile) {
      return generator.generateFromPlan(planResult.outputFile);
    }
    if (planResult && Array.isArray(planResult)) {
      const results = [];
      for (const plan of planResult) {
        results.push(await generator.generateFromPlan(plan.outputFile));
      }
      return results;
    }

    // If no plan result, look for the latest plan in output
    const planDir = path.resolve(__dirname, '../planner/output');
    if (fs.existsSync(planDir)) {
      const files = fs.readdirSync(planDir).filter((f) => f.endsWith('.feature'));
      if (files.length > 0) {
        const latest = files[files.length - 1];
        return generator.generateFromPlan(path.join(planDir, latest));
      }
    }

    console.log('[Orchestrator] No plan available for generation');
    return null;
  }

  async _runHealer() {
    console.log('\n--- Step: HEAL ---');
    const healer = new HealerAgent({ dryRun: this.dryRun });
    return healer.healFromReport();
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    steps: ['plan', 'generate', 'heal'],
    dryRun: args.includes('--dry-run')
  };

  // Parse --steps=plan,generate
  const stepsArg = args.find((a) => a.startsWith('--steps='));
  if (stepsArg) {
    options.steps = stepsArg.split('=')[1].split(',');
  }

  // Parse --story=HCMAT-123
  const storyArg = args.find((a) => a.startsWith('--story='));
  if (storyArg) {
    options.storyKey = storyArg.split('=')[1];
  }

  // Parse --local=path/to/story.json
  const localArg = args.find((a) => a.startsWith('--local='));
  if (localArg) {
    options.localStory = localArg.split('=')[1];
  }

  const orchestrator = new Orchestrator(options);
  orchestrator.run().then((results) => {
    console.log('\n[Orchestrator] Results:', JSON.stringify(results, null, 2));
  }).catch((err) => {
    console.error('[Orchestrator] Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = Orchestrator;