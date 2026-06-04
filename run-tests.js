// Run tests and generate report regardless of test pass/fail
const { execSync } = require('child_process');

// Step 1: Run tests (don't exit on failure — we still want the report)
try {
  execSync('npx cucumber-js features/createAbsence.feature --require features/**/*.js --require support/**/*.js --format progress --format json:reports/cucumber-report.json', {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (e) {
  console.log('\nTests completed with failures. Generating report...\n');
}

// Step 2: Generate HTML report (always runs)
try {
  execSync('node generate-report.js', { stdio: 'inherit', cwd: __dirname });
} catch (e) {
  console.error('Report generation failed:', e.message);
}
