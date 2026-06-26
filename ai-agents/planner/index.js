const fs = require('fs');
const path = require('path');
const JiraClient = require('./jiraClient');
const AcceptanceCriteriaBuilder = require('./acceptanceCriteriaBuilder');

class PlannerAgent {
  constructor() {
    this.jiraClient = new JiraClient();
    this.acBuilder = new AcceptanceCriteriaBuilder();
    this.outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async planFromStory(issueKey) {
    console.log(`[Planner] Fetching story: ${issueKey}`);
    const story = await this.jiraClient.fetchStory(issueKey);
    console.log(`[Planner] Story loaded: ${story.summary}`);

    const feature = this.acBuilder.buildFromStory(story);
    const gherkin = this.acBuilder.formatAsGherkin(feature);

    const outputFile = path.join(this.outputDir, `${issueKey}.feature`);
    fs.writeFileSync(outputFile, gherkin, 'utf-8');
    console.log(`[Planner] Acceptance criteria saved to: ${outputFile}`);

    return { issueKey, feature, gherkin, outputFile };
  }

  async planFromSprint() {
    console.log('[Planner] Fetching current sprint stories...');
    const stories = await this.jiraClient.fetchSprintStories();
    console.log(`[Planner] Found ${stories.length} stories in sprint`);

    const results = [];
    for (const story of stories) {
      const feature = this.acBuilder.buildFromStory(story);
      const gherkin = this.acBuilder.formatAsGherkin(feature);
      const outputFile = path.join(this.outputDir, `${story.key}.feature`);
      fs.writeFileSync(outputFile, gherkin, 'utf-8');
      results.push({ issueKey: story.key, feature, gherkin, outputFile });
    }

    console.log(`[Planner] Generated ${results.length} feature plans`);
    return results;
  }

  async planFromLocal(storyData) {
    console.log('[Planner] Building plan from local story data...');
    const feature = this.acBuilder.buildFromStory(storyData);
    const gherkin = this.acBuilder.formatAsGherkin(feature);

    const key = storyData.key || 'LOCAL';
    const outputFile = path.join(this.outputDir, `${key}.feature`);
    fs.writeFileSync(outputFile, gherkin, 'utf-8');
    console.log(`[Planner] Plan saved to: ${outputFile}`);

    return { issueKey: key, feature, gherkin, outputFile };
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const agent = new PlannerAgent();

  if (args[0] === '--story' && args[1]) {
    agent.planFromStory(args[1]).then((result) => {
      console.log('\n--- Generated Gherkin ---');
      console.log(result.gherkin);
    }).catch((err) => {
      console.error('[Planner] Error:', err.message);
      process.exit(1);
    });
  } else if (args[0] === '--sprint') {
    agent.planFromSprint().catch((err) => {
      console.error('[Planner] Error:', err.message);
      process.exit(1);
    });
  } else if (args[0] === '--local' && args[1]) {
    const storyFile = path.resolve(args[1]);
    const storyData = JSON.parse(fs.readFileSync(storyFile, 'utf-8'));
    agent.planFromLocal(storyData).then((result) => {
      console.log('\n--- Generated Gherkin ---');
      console.log(result.gherkin);
    }).catch((err) => {
      console.error('[Planner] Error:', err.message);
      process.exit(1);
    });
  } else {
    console.log('Usage:');
    console.log('  node ai-agents/planner/index.js --story HCMAT-123');
    console.log('  node ai-agents/planner/index.js --sprint');
    console.log('  node ai-agents/planner/index.js --local path/to/story.json');
  }
}

module.exports = PlannerAgent;