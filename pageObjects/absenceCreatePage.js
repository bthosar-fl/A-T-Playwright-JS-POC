const BasePage = require('./basePage');

class AbsenceCreatePage extends BasePage {
  constructor(page) {
    super(page);
    this.nextButton = "(//span[@class='ui-icon ui-icon-circle-triangle-e'][contains(text(),'Next')])[1]";
    this.entitlementSelect = "//select[@class='EntitlementType']";
    this.durationInput = "//input[contains(@class,'UserSpecifiedAbsenceDuration')]";
    this.createAbsenceButton = "(//span[text()='Create Absence'])[2]";
    this.okButton = "//*[contains(text(),'Your Confirmation Number is')]//span[text()='Ok']";
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
   * @param {string} reason - The label of the entitlement option to select.
   * @param {string} duration - The absence duration value to enter.
   */
  async fillAbsenceDetails(reason, duration) {
    await this.page.locator(this.entitlementSelect).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(500);
    try {
      await this.page.locator(this.entitlementSelect).selectOption({ label: reason });
    } catch (error) {
      // If selecting by label fails, try selecting by value
      await this.page.locator(this.entitlementSelect).selectOption(reason);
    }
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
    await this.page.waitForTimeout(2000);
  }

  async clickOK(){
    await this.page.waitForTimeout(2000);
    await this.page.locator(this.okButton).first().click();
  }
}

module.exports = AbsenceCreatePage;