// Assertion Utilities
// Common assertion helpers for Playwright tests

const { expect } = require('@playwright/test');

/**
 * Assert element has specific text
 */
async function assertText(page, selector, expectedText) {
  await expect(page.locator(selector)).toHaveText(expectedText);
}

/**
 * Assert element contains text (partial match)
 */
async function assertContainsText(page, selector, text) {
  await expect(page.locator(selector)).toContainText(text);
}

/**
 * Assert element is visible
 */
async function assertVisible(page, selector) {
  await expect(page.locator(selector)).toBeVisible();
}

/**
 * Assert element is hidden
 */
async function assertHidden(page, selector) {
  await expect(page.locator(selector)).toBeHidden();
}

/**
 * Assert element is enabled
 */
async function assertEnabled(page, selector) {
  await expect(page.locator(selector)).toBeEnabled();
}

/**
 * Assert element is disabled
 */
async function assertDisabled(page, selector) {
  await expect(page.locator(selector)).toBeDisabled();
}

/**
 * Assert input has specific value
 */
async function assertInputValue(page, selector, expectedValue) {
  await expect(page.locator(selector)).toHaveValue(expectedValue);
}

/**
 * Assert page URL matches pattern
 */
async function assertUrl(page, urlPattern) {
  if (typeof urlPattern === 'string') {
    await expect(page).toHaveURL(urlPattern);
  } else {
    await expect(page).toHaveURL(urlPattern);
  }
}

/**
 * Assert page title
 */
async function assertTitle(page, expectedTitle) {
  await expect(page).toHaveTitle(expectedTitle);
}

/**
 * Assert element count
 */
async function assertCount(page, selector, expectedCount) {
  await expect(page.locator(selector)).toHaveCount(expectedCount);
}

/**
 * Assert element has CSS class
 */
async function assertHasClass(page, selector, className) {
  await expect(page.locator(selector)).toHaveClass(new RegExp(className));
}

/**
 * Assert element has attribute with value
 */
async function assertAttribute(page, selector, attribute, value) {
  await expect(page.locator(selector)).toHaveAttribute(attribute, value);
}

/**
 * Assert checkbox is checked
 */
async function assertChecked(page, selector) {
  await expect(page.locator(selector)).toBeChecked();
}

/**
 * Assert checkbox is unchecked
 */
async function assertUnchecked(page, selector) {
  await expect(page.locator(selector)).not.toBeChecked();
}

/**
 * Soft assert - logs failure but doesn't stop test
 */
async function softAssert(assertionFn, description = '') {
  try {
    await assertionFn();
    return { passed: true, description };
  } catch (error) {
    console.warn(`[Soft Assert Failed] ${description}: ${error.message}`);
    return { passed: false, description, error: error.message };
  }
}

module.exports = {
  assertText,
  assertContainsText,
  assertVisible,
  assertHidden,
  assertEnabled,
  assertDisabled,
  assertInputValue,
  assertUrl,
  assertTitle,
  assertCount,
  assertHasClass,
  assertAttribute,
  assertChecked,
  assertUnchecked,
  softAssert
};
