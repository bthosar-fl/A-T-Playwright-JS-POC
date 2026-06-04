class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates the browser to the specified URL.
   * @param {string} url - The URL to navigate to.
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Clicks on the element matching the given locator.
   * @param {string} locator - The selector string for the target element.
   */
  async click(locator) {
    await this.page.locator(locator).click();
  }

  /**
   * Fills the specified input element with the given value.
   * @param {string} locator - The selector string for the input element.
   * @param {string} value - The text value to fill.
   */
  async fill(locator, value) {
    await this.page.locator(locator).fill(value);
  }

  /**
   * Returns an element matching the specified ARIA role and options.
   * @param {string} role - The ARIA role to search for (e.g., 'button', 'link').
   * @param {Object} options - Options for narrowing the role query (e.g., { name: 'Submit' }).
   * @returns {import('@playwright/test').Locator} The matching locator.
   */
  async getByRole(role, options) {
    return this.page.getByRole(role, options);
  }

  /**
   * Selects an option from a dropdown element.
   * @param {string} selector - The selector string for the dropdown element.
   * @param {string} value - The value to select.
   */
  async selectOption(selector, value) {
    await this.page.locator(selector).selectOption(value);
  }
}

module.exports = BasePage;
