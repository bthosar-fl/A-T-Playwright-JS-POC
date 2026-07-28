const fs = require('fs');
const path = require('path');

class FeatureGenerator {
  constructor(outputDir) {
    this.outputDir = outputDir || path.resolve(__dirname, '../../features');
  }

  generate(featureData) {
    const lines = [];
    lines.push(`Feature: ${featureData.name}`);
    lines.push('');

    for (const scenario of featureData.scenarios) {
      lines.push(`  Scenario: ${scenario.name}`);
      for (const step of scenario.steps) {
        lines.push(`    ${step}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  writeFeatureFile(featureData, filename) {
    const content = this.generate(featureData);
    const safeName = filename || this._toFilename(featureData.name);
    const filePath = path.join(this.outputDir, safeName);

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[Generator] Feature file written: ${filePath}`);
    return filePath;
  }

  _toFilename(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.feature';
  }
}

module.exports = FeatureGenerator;