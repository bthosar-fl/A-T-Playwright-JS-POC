const fs = require('fs');
const path = require('path');

class AcceptanceCriteriaBuilder {
  constructor() {
    this.existingStepPatterns = this._loadExistingStepPatterns();
  }

  _loadExistingStepPatterns() {
    const stepDefsDir = path.resolve(__dirname, '../../features/stepDefinitions');
    const patterns = [];
    if (!fs.existsSync(stepDefsDir)) return patterns;

    const files = fs.readdirSync(stepDefsDir).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(stepDefsDir, file), 'utf-8');
      const matches = content.matchAll(/(Given|When|Then)\(['"](.+?)['"]/g);
      for (const match of matches) {
        patterns.push({ keyword: match[1], pattern: match[2] });
      }
    }
    return patterns;
  }

  buildFromStory(story) {
    const feature = {
      name: story.summary,
      key: story.key,
      scenarios: []
    };

    if (story.acceptanceCriteria) {
      const parsed = this._parseExistingAC(story.acceptanceCriteria);
      if (parsed.length > 0) {
        feature.scenarios = parsed;
        return feature;
      }
    }

    feature.scenarios.push(this._generateScenarioFromDescription(story));
    return feature;
  }

  _parseExistingAC(acText) {
    const scenarios = [];
    const lines = acText.split('\n').map((l) => l.trim()).filter(Boolean);
    let currentScenario = null;

    for (const line of lines) {
      if (line.match(/^scenario/i)) {
        if (currentScenario) scenarios.push(currentScenario);
        currentScenario = { name: line.replace(/^scenario[:\s]*/i, ''), steps: [] };
      } else if (line.match(/^(given|when|then|and)\s/i)) {
        if (!currentScenario) {
          currentScenario = { name: 'Main Scenario', steps: [] };
        }
        currentScenario.steps.push(line);
      }
    }
    if (currentScenario && currentScenario.steps.length > 0) {
      scenarios.push(currentScenario);
    }
    return scenarios;
  }

  _generateScenarioFromDescription(story) {
    return {
      name: story.summary,
      steps: [
        'Given Application is open in the browser',
        'When User logs in using "appUsername" and "appPassword"',
        'Then User is logged in successfully and is redirected to application homepage',
        `# TODO: Add steps specific to "${story.summary}"`
      ]
    };
  }

  formatAsGherkin(featureData) {
    const lines = [`Feature: ${featureData.name}`, ''];
    for (const scenario of featureData.scenarios) {
      lines.push(`  Scenario: ${scenario.name}`);
      for (const step of scenario.steps) {
        lines.push(`    ${step}`);
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  suggestExistingSteps(stepText) {
    const normalised = stepText.toLowerCase().replace(/['"{}]/g, '');
    return this.existingStepPatterns.filter((p) => {
      const patNorm = p.pattern.toLowerCase().replace(/['"{}]/g, '');
      return patNorm.includes(normalised) || normalised.includes(patNorm);
    });
  }
}

module.exports = AcceptanceCriteriaBuilder;