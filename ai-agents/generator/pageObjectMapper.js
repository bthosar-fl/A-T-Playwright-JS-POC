const fs = require('fs');
const path = require('path');

class PageObjectMapper {
  constructor() {
    this.pageObjectsDir = path.resolve(__dirname, '../../pageObjects');
    this.pageObjects = this._scanPageObjects();
  }

  _scanPageObjects() {
    const pages = {};
    if (!fs.existsSync(this.pageObjectsDir)) return pages;

    const files = fs.readdirSync(this.pageObjectsDir).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(this.pageObjectsDir, file), 'utf-8');
      const className = this._extractClassName(content);
      const methods = this._extractMethods(content);
      pages[file] = { className, methods, file };
    }
    return pages;
  }

  _extractClassName(content) {
    const match = content.match(/class\s+(\w+)/);
    return match ? match[1] : 'Unknown';
  }

  _extractMethods(content) {
    const methods = [];
    const matches = content.matchAll(/async\s+(\w+)\s*\(([^)]*)\)/g);
    for (const match of matches) {
      methods.push({ name: match[1], params: match[2].trim() });
    }
    return methods;
  }

  findMethodForStep(stepText) {
    const normalised = stepText.toLowerCase();
    for (const [file, po] of Object.entries(this.pageObjects)) {
      for (const method of po.methods) {
        const methodWords = method.name.replace(/([A-Z])/g, ' $1').toLowerCase();
        if (normalised.includes(methodWords.trim()) || methodWords.includes(normalised)) {
          return { file, className: po.className, method };
        }
      }
    }
    return null;
  }

  getAvailablePages() {
    return Object.entries(this.pageObjects).map(([file, po]) => ({
      file,
      className: po.className,
      methods: po.methods.map((m) => `${m.name}(${m.params})`)
    }));
  }

  generatePageObjectStub(name, methods) {
    const className = name.charAt(0).toUpperCase() + name.slice(1) + 'Page';
    const lines = [
      `const BasePage = require('./basePage');`,
      '',
      `class ${className} extends BasePage {`,
      '  constructor(page) {',
      '    super(page);',
      '  }',
      ''
    ];

    for (const method of methods) {
      lines.push(`  async ${method.name}(${method.params || ''}) {`);
      lines.push(`    // TODO: Implement ${method.name}`);
      lines.push('  }');
      lines.push('');
    }

    lines.push('}');
    lines.push('');
    lines.push(`module.exports = ${className};`);
    return lines.join('\n');
  }
}

module.exports = PageObjectMapper;