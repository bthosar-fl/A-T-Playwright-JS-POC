// Browser & Page Utilities
// Common browser-level operations for Playwright

/**
 * Handle native browser dialogs (alert, confirm, prompt)
 * Call BEFORE the action that triggers the dialog
 */
function handleDialog(page, action = 'accept', responseText = '') {
  page.on('dialog', async (dialog) => {
    console.log(`[Dialog] Type: ${dialog.type()}, Message: ${dialog.message()}`);
    if (action === 'accept') {
      await dialog.accept(responseText);
    } else {
      await dialog.dismiss();
    }
  });
}

/**
 * Handle dialog and capture its message
 */
function captureDialog(page) {
  let dialogMessage = null;
  page.on('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  return () => dialogMessage;
}

/**
 * Take a screenshot with descriptive name
 */
async function takeScreenshot(page, name, options = {}) {
  const { fullPage = true, dir = 'screenshots' } = options;
  const path = require('path');
  const fs = require('fs');
  const screenshotDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const filename = `${name}-${Date.now()}.png`;
  const filepath = path.join(screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage });
  console.log(`[Screenshot] Saved: ${filepath}`);
  return filepath;
}

/**
 * Switch to a new tab/popup opened by an action
 */
async function switchToNewTab(context, action) {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    action()
  ]);
  await newPage.waitForLoadState();
  return newPage;
}

/**
 * Get all open pages in the context
 */
function getAllPages(context) {
  return context.pages();
}

/**
 * Close all tabs except the first one
 */
async function closeExtraTabs(context) {
  const pages = context.pages();
  for (let i = 1; i < pages.length; i++) {
    await pages[i].close();
  }
}

/**
 * Switch to an iframe
 */
async function switchToFrame(page, frameSelector) {
  const frame = page.frameLocator(frameSelector);
  return frame;
}

/**
 * Get the current page URL
 */
function getCurrentUrl(page) {
  return page.url();
}

/**
 * Get the page title
 */
async function getPageTitle(page) {
  return await page.title();
}

/**
 * Reload page and wait for load
 */
async function reloadPage(page, options = {}) {
  const { waitUntil = 'domcontentloaded' } = options;
  await page.reload({ waitUntil });
}

/**
 * Go back in browser history
 */
async function goBack(page) {
  await page.goBack({ waitUntil: 'domcontentloaded' });
}

/**
 * Set viewport size
 */
async function setViewport(page, width, height) {
  await page.setViewportSize({ width, height });
}

/**
 * Scroll to top of page
 */
async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Scroll to bottom of page
 */
async function scrollToBottom(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

/**
 * Execute JavaScript in page context
 */
async function evaluate(page, fn, ...args) {
  return await page.evaluate(fn, ...args);
}

/**
 * Get browser console logs (must set up listener before actions)
 */
function captureConsoleLogs(page) {
  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text(), timestamp: Date.now() });
  });
  return () => logs;
}

module.exports = {
  handleDialog,
  captureDialog,
  takeScreenshot,
  switchToNewTab,
  getAllPages,
  closeExtraTabs,
  switchToFrame,
  getCurrentUrl,
  getPageTitle,
  reloadPage,
  goBack,
  setViewport,
  scrollToTop,
  scrollToBottom,
  evaluate,
  captureConsoleLogs
};
