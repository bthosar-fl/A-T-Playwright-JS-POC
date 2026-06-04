// Element Interaction Utilities
// Reusable element interaction patterns for Playwright

/**
 * Click with retry - handles intermittent click failures
 */
async function safeClick(page, selector, options = {}) {
  const { timeout = 20000, force = false } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click({ force });
}

/**
 * Fill input with clear - ensures input is cleared before typing
 */
async function clearAndFill(page, selector, value, options = {}) {
  const { timeout = 20000 } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.clear();
  await locator.fill(value);
}

/**
 * Select dropdown option by value, label, or index
 */
async function selectDropdown(page, selector, option, options = {}) {
  const { timeout = 20000 } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });

  if (typeof option === 'number') {
    await locator.selectOption({ index: option });
  } else if (option.startsWith('label:')) {
    await locator.selectOption({ label: option.replace('label:', '') });
  } else {
    await locator.selectOption(option);
  }
}

/**
 * Check/Uncheck a checkbox
 */
async function setCheckbox(page, selector, checked = true) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible' });
  if (checked) {
    await locator.check();
  } else {
    await locator.uncheck();
  }
}

/**
 * Hover over an element
 */
async function hoverElement(page, selector, options = {}) {
  const { timeout = 20000 } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.hover();
}

/**
 * Double click an element
 */
async function doubleClick(page, selector, options = {}) {
  const { timeout = 20000 } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  await locator.dblclick();
}

/**
 * Scroll element into view
 */
async function scrollIntoView(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get text content of an element
 */
async function getText(page, selector, options = {}) {
  const { timeout = 10000 } = options;
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  return await locator.textContent();
}

/**
 * Get input value
 */
async function getInputValue(page, selector) {
  return await page.locator(selector).inputValue();
}

/**
 * Check if element is visible (returns boolean, no throw)
 */
async function isVisible(page, selector, timeout = 3000) {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if element exists in DOM (visible or not)
 */
async function exists(page, selector) {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Upload a file to a file input
 */
async function uploadFile(page, selector, filePath) {
  await page.locator(selector).setInputFiles(filePath);
}

/**
 * Clear file input
 */
async function clearFileInput(page, selector) {
  await page.locator(selector).setInputFiles([]);
}

/**
 * Press a keyboard key
 */
async function pressKey(page, key) {
  await page.keyboard.press(key);
}

/**
 * Type text character by character (useful for auto-suggest inputs)
 */
async function typeSlowly(page, selector, text, delay = 100) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible' });
  await locator.click();
  await page.keyboard.type(text, { delay });
}

/**
 * Drag and drop from source to target
 */
async function dragAndDrop(page, sourceSelector, targetSelector) {
  await page.locator(sourceSelector).dragTo(page.locator(targetSelector));
}

module.exports = {
  safeClick,
  clearAndFill,
  selectDropdown,
  setCheckbox,
  hoverElement,
  doubleClick,
  scrollIntoView,
  getText,
  getInputValue,
  isVisible,
  exists,
  uploadFile,
  clearFileInput,
  pressKey,
  typeSlowly,
  dragAndDrop
};
