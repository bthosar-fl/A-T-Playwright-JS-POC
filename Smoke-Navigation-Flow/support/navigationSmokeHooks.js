/** Cucumber hooks that manage the browser and smoke-run artifacts. */
const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('../../pageObjects/loginPage');
const { getBrowserName, getConfig } = require('../Runners/navigationSmokeRuntime');

setDefaultTimeout(120 * 1000);

let browser;
let context;
let page;
const reportDir = process.env.SMOKE_REPORT_DIR;

/**
 * Launches the browser requested for this run.
 * Chrome and Edge use Chromium channels; Firefox and WebKit use their Playwright engines.
 * @returns {Promise<import('playwright').Browser>} The launched browser.
 */
async function launchBrowser() {
  const headless = process.env.SMOKE_HEADLESS === 'true' || getConfig().headless === true;
  const options = { headless };
  switch (getBrowserName()) {
    case 'edge':
      return chromium.launch({ ...options, channel: 'msedge', args: ['--start-maximized'] });
    case 'firefox':
      return firefox.launch(options);
    case 'webkit':
      return webkit.launch(options);
    default:
      return chromium.launch({ ...options, channel: 'chrome', args: ['--start-maximized'] });
  }
}

/**
 * Starts the selected browser and creates the report folders for a priority run.
 * Video recording is enabled only when the selected config sets video to true.
 */
BeforeAll(async () => {
  if (!reportDir) throw new Error('SMOKE_REPORT_DIR is required. Start tests with npm run smoke.');
  fs.mkdirSync(path.join(reportDir, 'screenshots'), { recursive: true });
  const headless = process.env.SMOKE_HEADLESS === 'true' || getConfig().headless === true;
  console.log(`[Smoke] Launching ${getBrowserName()} in ${headless ? 'headless' : 'headed'} mode.`);
  browser = await launchBrowser();
  const contextOptions = { viewport: null };
  if (process.env.SMOKE_VIDEO === 'true') {
    contextOptions.recordVideo = { dir: path.join(reportDir, 'videos') };
  }
  context = await browser.newContext(contextOptions);
  page = await context.newPage();
});

/**
 * Makes the shared Playwright page available to every Cucumber scenario.
 */
Before(function () {
  this.page = page;
});

/**
 * Saves and attaches a full-page screenshot when a scenario fails.
 * @param {import('@cucumber/cucumber').ITestCaseHookParameter} scenario Completed scenario details.
 */
After(async function (scenario) {
  if (scenario.result?.status !== 'FAILED') return;
  const file = path.join(reportDir, 'screenshots', `${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  this.attach(fs.readFileSync(file), 'image/png');
});

/**
 * Logs out after the user's final priority group, then closes browser resources.
 * The logout is safely skipped when the scenario never reached an authenticated page.
 */
AfterAll(async () => {
  if (process.env.SMOKE_LAST_PRIORITY === 'true') {
    try {
      await new LoginPage(page).logout();
    } catch (_) {
      // Some failed scenarios never reach an authenticated page.
    }
  }
  await context?.close();
  await browser?.close();
});
