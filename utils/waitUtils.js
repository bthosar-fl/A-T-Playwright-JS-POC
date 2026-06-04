// Wait & Sync Utilities
// Common wait patterns for Playwright automation

/**
 * Wait for an element to be visible with custom timeout
 */
async function waitForVisible(page, selector, timeout = 20000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

/**
 * Wait for an element to be hidden/removed
 */
async function waitForHidden(page, selector, timeout = 20000) {
  await page.locator(selector).waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for page to reach network idle state
 */
async function waitForNetworkIdle(page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for navigation to complete after an action
 */
async function waitForNavigation(page, action, options = {}) {
  const { waitUntil = 'domcontentloaded', timeout = 20000 } = options;
  await Promise.all([
    page.waitForNavigation({ waitUntil, timeout }),
    action()
  ]);
}

/**
 * Wait for a specific URL pattern
 */
async function waitForUrl(page, urlPattern, timeout = 20000) {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Wait for a specific response from network
 */
async function waitForResponse(page, urlPattern, action) {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes(urlPattern)),
    action()
  ]);
  return response;
}

/**
 * Retry an action until it succeeds or max retries reached
 */
async function retryAction(action, maxRetries = 3, delayMs = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

/**
 * Wait for element text to match expected value
 */
async function waitForText(page, selector, expectedText, timeout = 10000) {
  await page.locator(selector).filter({ hasText: expectedText }).waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element count to reach expected number
 */
async function waitForElementCount(page, selector, expectedCount, timeout = 10000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const count = await page.locator(selector).count();
    if (count === expectedCount) return count;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Expected ${expectedCount} elements for "${selector}", timed out after ${timeout}ms`);
}

module.exports = {
  waitForVisible,
  waitForHidden,
  waitForNetworkIdle,
  waitForNavigation,
  waitForUrl,
  waitForResponse,
  retryAction,
  waitForText,
  waitForElementCount
};
