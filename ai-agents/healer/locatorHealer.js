const fs = require('fs');
const path = require('path');

class LocatorHealer {
  constructor() {
    this.pageObjectsDir = path.resolve(__dirname, '../../pageObjects');
  }

  heal(failure) {
    if (!failure.location) return null;

    const filePath = path.resolve(__dirname, '../../', failure.location.split(':')[0]);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lineNum = parseInt(failure.location.split(':')[1]) - 1;
    const lines = content.split('\n');

    if (lineNum >= lines.length) return null;

    const failedLine = lines[lineNum];
    const locator = this._extractLocator(failedLine);
    if (!locator) return null;

    const alternatives = this._suggestAlternatives(locator, failure.errorMessage);

    return {
      file: filePath,
      line: lineNum + 1,
      original: locator,
      alternatives,
      suggestion: alternatives[0] || null
    };
  }

  _extractLocator(line) {
    // Match common Playwright locator patterns
    const patterns = [
      /locator\(['"](.+?)['"]\)/,
      /getByRole\(['"](.+?)['"](?:,\s*\{[^}]*\})?\)/,
      /getByText\(['"](.+?)['"]\)/,
      /getByTestId\(['"](.+?)['"]\)/,
      /getByLabel\(['"](.+?)['"]\)/,
      /\$\(['"](.+?)['"]\)/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) return { full: match[0], selector: match[1], type: this._getLocatorType(match[0]) };
    }
    return null;
  }

  _getLocatorType(locatorStr) {
    if (locatorStr.includes('getByRole')) return 'role';
    if (locatorStr.includes('getByText')) return 'text';
    if (locatorStr.includes('getByTestId')) return 'testid';
    if (locatorStr.includes('getByLabel')) return 'label';
    return 'css';
  }

  _suggestAlternatives(locator, errorMessage) {
    const alternatives = [];

    switch (locator.type) {
      case 'css':
        // Suggest role-based alternatives
        alternatives.push(`page.getByRole('button', { name: '${locator.selector}' })`);
        alternatives.push(`page.getByText('${locator.selector}')`);
        alternatives.push(`page.locator('${locator.selector}').first()`);
        break;
      case 'role':
        alternatives.push(`page.getByText('${locator.selector}')`);
        alternatives.push(`page.locator('[aria-label="${locator.selector}"]')`);
        break;
      case 'text':
        alternatives.push(`page.getByRole('button', { name: '${locator.selector}' })`);
        alternatives.push(`page.locator(':text("${locator.selector}")')`);
        break;
      default:
        alternatives.push(`page.getByText('${locator.selector}')`);
    }

    return alternatives;
  }

  applyFix(healResult, dryRun = false) {
    if (!healResult || !healResult.suggestion) return false;

    const content = fs.readFileSync(healResult.file, 'utf-8');
    const updated = content.replace(healResult.original.full, healResult.suggestion);

    if (updated === content) return false;

    if (!dryRun) {
      // Create backup
      const backupPath = healResult.file + '.bak';
      fs.writeFileSync(backupPath, content, 'utf-8');
      fs.writeFileSync(healResult.file, updated, 'utf-8');
      console.log(`[Healer] Fixed locator in ${healResult.file}:${healResult.line}`);
    }
    return true;
  }
}

module.exports = LocatorHealer;