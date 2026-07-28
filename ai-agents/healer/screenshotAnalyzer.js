const fs = require('fs');
const path = require('path');

class ScreenshotAnalyzer {
  constructor() {
    this.screenshotsDir = path.resolve(__dirname, '../../screenshots');
  }

  analyze(failure) {
    const screenshots = this._findScreenshots(failure);
    if (screenshots.length === 0) {
      return { available: false, message: 'No screenshot found for this failure' };
    }

    return {
      available: true,
      screenshots,
      analysis: this._basicAnalysis(screenshots[0]),
      message: `Found ${screenshots.length} screenshot(s) for review`
    };
  }

  _findScreenshots(failure) {
    if (!fs.existsSync(this.screenshotsDir)) return [];

    const files = fs.readdirSync(this.screenshotsDir);
    const scenarioSlug = (failure.scenario || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    return files
      .filter((f) => f.endsWith('.png') || f.endsWith('.jpg'))
      .filter((f) => {
        const fLower = f.toLowerCase();
        return fLower.includes(scenarioSlug) || fLower.includes('failure') || fLower.includes('error');
      })
      .map((f) => path.join(this.screenshotsDir, f));
  }

  _basicAnalysis(screenshotPath) {
    // Basic file-level analysis without vision AI
    const stats = fs.statSync(screenshotPath);
    return {
      file: screenshotPath,
      size: stats.size,
      timestamp: stats.mtime.toISOString(),
      note: 'Vision-based analysis requires LLM integration (future enhancement)'
    };
  }
}

module.exports = ScreenshotAnalyzer;