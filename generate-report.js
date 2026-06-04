// Generate HTML Report from Cucumber JSON output
// Usage: node generate-report.js

const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const jsonReportDir = path.join(process.cwd(), 'reports');
const jsonReportFile = path.join(jsonReportDir, 'cucumber-report.json');

if (!fs.existsSync(jsonReportFile)) {
  console.error('No cucumber-report.json found in reports/ folder.');
  console.error('Run tests first: npm run test:report');
  process.exit(1);
}

report.generate({
  jsonDir: jsonReportDir,
  reportPath: path.join(process.cwd(), 'reports', 'html-report'),
  openReportInBrowser: true,
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    device: 'Desktop',
    platform: { name: 'Windows', version: '11' }
  },
  customData: {
    title: 'Test Execution Info',
    data: [
      { label: 'Project', value: 'Absence Management - E2E' },
      { label: 'Framework', value: 'Playwright + Cucumber' },
      { label: 'Environment', value: 'Stage' },
      { label: 'Execution Date', value: new Date().toLocaleString() }
    ]
  }
});

console.log('Report generated at: reports/html-report/index.html');
