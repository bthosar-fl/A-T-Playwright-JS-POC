const BasePage = require('./basePage');

class AbsenceReasonPage extends BasePage {
  constructor(page) {
    super(page);
    this.addButtonText = 'Add Absence Reason';
  }

  /**
   * Opens the Absence Reasons page via the Reference Data menu.
   */
  async open() {
  await this.page.getByRole('menuitem', { name: 'Reference Data' }).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.getByRole('menuitem', { name: 'Reference Data' }).click();
  await this.page.getByRole('link', { name: 'Absence Reasons' }).click();
}

/**
 * Clicks the Add Absence Reason button.
 */
async clickAdd() {
  await this.page.getByText(this.addButtonText).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.getByText(this.addButtonText).click();
}

/**
 * Creates a new absence reason with the provided details.
 * @param {Object} params - The absence reason parameters.
 * @param {string} params.name - The name of the absence reason.
 * @param {string} [params.schoolLabel] - Optional school label to select.
 * @param {string} [params.comboboxValue] - Optional combobox value to select.
 * @param {boolean} [params.makePublic] - Whether to make the reason public to employees.
 */
async createReason({ name, schoolLabel, comboboxValue, makePublic }) {
  await this.page.getByRole('textbox', { name: 'Enter Name Here' }).fill(name);
  await this.page.getByText('Schools', { exact: true }).click();
  if (schoolLabel) {
    await this.page.locator('label').filter({ hasText: schoolLabel }).click();
  }
  if (comboboxValue) {
    await this.page.getByRole('combobox').selectOption(comboboxValue);
  }
  if (makePublic) {
    await this.page.locator('ng-form').getByText('Public to Employee').click();
  }
  await this.page.getByText('Save').click();
}

/**
 * Verifies that an absence reason with the given name is visible on the page.
 * @param {string} name - The name of the absence reason to verify.
 */
async verifyReasonCreated(name) {
  await this.page.getByRole('link', { name }).waitFor({ state: 'visible', timeout: 20000 });
}
}

module.exports = AbsenceReasonPage;
