const fs = require('fs');
const path = require('path');

class StepHealer {
  constructor() {
    this.stepDefsDir = path.resolve(__dirname, '../../features/stepDefinitions');
    this.featuresDir = path.resolve(__dirname, '../../features');
  }

  heal(failure) {
    if (failure.type !== 'step_mismatch') return null;

    const errorMsg = failure.errorMessage;

    if (errorMsg.toLowerCase().includes('undefined')) {
      return this._healUndefinedStep(failure);
    }
    if (errorMsg.toLowerCase().includes('ambiguous')) {
      return this._healAmbiguousStep(failure);
    }

    return null;
  }

  _healUndefinedStep(failure) {
    const stepText = failure.step;
    const keyword = failure.keyword || 'Then';

    // Check if a similar step exists with a typo
    const closestMatch = this._findClosestStep(stepText);
    if (closestMatch) {
      return {
        action: 'align_step_text',
        step: stepText,
        suggestion: closestMatch.pattern,
        file: closestMatch.file,
        message: `Step "${stepText}" is undefined. Closest match: "${closestMatch.pattern}" in ${closestMatch.file}`
      };
    }

    // Generate a new step definition stub
    const parameterised = stepText.replace(/"[^"]*"/g, '"{string}"');
    const params = (stepText.match(/"[^"]*"/g) || []).map((_, i) => `param${i + 1}`).join(', ');
    const stub = `${keyword}('${parameterised}', async function (${params}) {\n  // TODO: Implement\n});`;

    return {
      action: 'create_step_def',
      step: stepText,
      pattern: parameterised,
      stub,
      message: `Step "${stepText}" needs a new step definition`
    };
  }

  _healAmbiguousStep(failure) {
    // Find all matching definitions
    const stepText = failure.step;
    const matches = this._findAllMatches(stepText);

    return {
      action: 'resolve_ambiguity',
      step: stepText,
      matches: matches.map((m) => ({ pattern: m.pattern, file: m.file })),
      message: `Step "${stepText}" matches multiple definitions. Consider making patterns more specific.`
    };
  }

  _findClosestStep(stepText) {
    const existingSteps = this._loadAllStepPatterns();
    let best = null;
    let bestScore = 0;

    const normalised = stepText.toLowerCase().replace(/['"]/g, '');

    for (const step of existingSteps) {
      const patNorm = step.pattern.toLowerCase()
        .replace(/\{string\}/g, '')
        .replace(/\{int\}/g, '')
        .replace(/['"]/g, '');
      const score = this._similarity(normalised, patNorm);
      if (score > bestScore && score > 0.6) {
        bestScore = score;
        best = step;
      }
    }

    return best;
  }

  _findAllMatches(stepText) {
    const existingSteps = this._loadAllStepPatterns();
    return existingSteps.filter((s) => {
      const regex = s.pattern
        .replace(/\{string\}/g, '"[^"]*"')
        .replace(/\{int\}/g, '\\d+');
      try {
        return new RegExp(regex).test(stepText);
      } catch {
        return false;
      }
    });
  }

  _loadAllStepPatterns() {
    const patterns = [];
    if (!fs.existsSync(this.stepDefsDir)) return patterns;

    const files = fs.readdirSync(this.stepDefsDir).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(this.stepDefsDir, file), 'utf-8');
      const matches = content.matchAll(/(Given|When|Then)\(\s*['"](.+?)['"]/g);
      for (const m of matches) {
        patterns.push({ keyword: m[1], pattern: m[2], file });
      }
    }
    return patterns;
  }

  _similarity(a, b) {
    const wordsA = a.split(/\s+/);
    const wordsB = b.split(/\s+/);
    const common = wordsA.filter((w) => wordsB.includes(w));
    return common.length / Math.max(wordsA.length, wordsB.length);
  }
}

module.exports = StepHealer;