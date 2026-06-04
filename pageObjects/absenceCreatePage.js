const BasePage = require('./basePage');

class AbsenceCreatePage extends BasePage {
  constructor(page) {
    super(page);
    this.createAbsenceLink = "//a[@title='Create Absence']";
    this.nextButton = "(//span[@class='ui-icon ui-icon-circle-triangle-e'][contains(text(),'Next')])[1]";
    this.entitlementSelect = "//select[@class='EntitlementType']";
    this.durationInput = "//input[contains(@class,'UserSpecifiedAbsenceDuration')]";
    this.createAbsenceButton = "(//span[text()='Create Absence'])[2]";
  }

  /**
   * Navigates to the Create Absence page via the Absences menu.
   */
  async navigateToCreateAbsence() {
    await this.page.getByRole('menuitem', { name: 'Absences' }).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.getByRole('menuitem', { name: 'Absences' }).click();
    await this.page.locator(this.createAbsenceLink).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator(this.createAbsenceLink).click();
    await this.page.locator(this.createAbsenceLink).waitFor({ state: 'hidden', timeout: 20000 });
  }

  /**
   * Selects an absence date by navigating to the next month and clicking a day.
   * @param {number} dayIndex - The 1-based index of the day cell to select.
   */
  async selectDate(dayIndex) {
    await this.page.locator(this.nextButton).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator(this.nextButton).click();
    await this.page.locator(`(//tr[2]//td[@data-handler='selectDay'][${dayIndex}])[1]`).click();
  }

  /**
   * Fills in the absence entitlement type and duration.
   * @param {number} entitlementIndex - The index of the entitlement option to select.
   * @param {string} duration - The absence duration value to enter.
   */
  async fillAbsenceDetails(entitlementIndex, duration) {
    await this.page.locator(this.entitlementSelect).selectOption({ index: entitlementIndex });
    await this.page.locator(this.durationInput).fill(duration);
  }

  /**
   * Submits the absence creation form and accepts the confirmation dialog.
   */
  async submitAbsence() {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.locator(this.createAbsenceButton).click();
  }
}

module.exports = AbsenceCreatePage;