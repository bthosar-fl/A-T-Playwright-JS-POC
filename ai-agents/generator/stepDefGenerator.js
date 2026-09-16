const fs = require('fs');
const path = require('path');

class StepDefGenerator {
  constructor() {
    this.stepDefsDir = path.resolve(__dirname, '../../stepDefinitions');
  }

  generateFromFeature(featureContent) {
    const steps = this._extractSteps(featureContent);
    const existingPatterns = this._loadExistingPatterns();
    const newSteps = steps.filter((s) => !this._stepExists(s, existingPatterns));

    if (newSteps.length === 0) {
      console.log('[Generator] All steps already have definitions');
      return null;
    }

    return this._buildStepDefFile(newSteps);
  }

  _extractSteps(featureContent) {
    const steps = [];
    const lines = featureContent.split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^(Given|When|Then|And|But)\s+(.+)$/);
      if (match) {
        const keyword = match[1] === 'And' || match[1] === 'But' ? 'Then' : match[1];
        steps.push({ keyword, text: match[2] });
      }
    }
    return steps;
  }

  _loadExistingPatterns() {
    const patterns = [];
    if (!fs.existsSync(this.stepDefsDir)) return patterns;

    const files = fs.readdirSync(this.stepDefsDir).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(this.stepDefsDir, file), 'utf-8');
      const matches = content.matchAll(/(Given|When|Then)\(\s*['"](.+?)['"]/g);
      for (const m of matches) {
        patterns.push(m[2]);
      }
    }
    return patterns;
  }

  _stepExists(step, existingPatterns) {
    const parameterised = step.text.replace(/"[^"]*"/g, '"{string}"');
    return existingPatterns.some((pattern) => {
      const patternRegex = pattern
        .replace(/\{string\}/g, '"[^"]*"')
        .replace(/\{int\}/g, '\\d+');
      try {
        return new RegExp(`^${patternRegex}$`).test(step.text) ||
               pattern === parameterised;
      } catch {
        return pattern === parameterised;
      }
    });
  }

  _buildStepDefFile(steps) {
    const lines = [
      "const { Given, When, Then } = require('@cucumber/cucumber');",
      ''
    ];

    const seen = new Set();
    for (const step of steps) {
      const pattern = step.text.replace(/"[^"]*"/g, '"{string}"');
      if (seen.has(pattern)) continue;
      seen.add(pattern);

      const params = this._extractParams(pattern);
      lines.push(`${step.keyword}('${pattern}', async function (${params}) {`);
      lines.push('  // TODO: Implement this step');
      lines.push('});');
      lines.push('');
    }

    return lines.join('\n');
  }

  _extractParams(pattern) {
    const matches = pattern.match(/\{string\}/g) || [];
    return matches.map((_, i) => `param${i + 1}`).join(', ');
  }

  writeStepDefFile(content, filename) {
    if (!content) return null;
    if (!fs.existsSync(this.stepDefsDir)) {
      fs.mkdirSync(this.stepDefsDir, { recursive: true });
    }
    const filePath = path.join(this.stepDefsDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[Generator] Step definitions written: ${filePath}`);
    return filePath;
  }
}

module.exports = StepDefGenerator;
