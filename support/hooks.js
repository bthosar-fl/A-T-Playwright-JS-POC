const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

setDefaultTimeout(120 * 1000);

let browser;
const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

Before(async function () {
  browser = await playwright.chromium.launch({ headless: false });
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  try {
    if (scenario.result && scenario.result.status === 'FAILED' && this.page) {
      const ts = Date.now();
      const filename = path.join(screenshotsDir, `failed-${ts}.png`);
      await this.page.screenshot({ path: filename, fullPage: true });
      console.log('Saved failure screenshot:', filename);

      // Attach screenshot to Cucumber report so it appears in HTML report
      const screenshotBuffer = fs.readFileSync(filename);
      this.attach(screenshotBuffer, 'image/png');
    }
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  }

  try {
    if (this.page) await this.page.close();
  } catch (e) {
    console.warn('Error closing page:', e.message);
  }
  try {
    if (this.context) await this.context.close();
  } catch (e) {
    console.warn('Error closing context:', e.message);
  }
  try {
    if (browser) await browser.close();
  } catch (e) {
    console.warn('Error closing browser:', e.message);
  }
});

