const BasePage = require('./basePage');

class AbsenceCreatePage extends BasePage {
  constructor(page) {
    super(page);
    this.createAbsenceLink = "//a[@title='Create Absence']";
    this.nextButton = "(//span[@class='ui-icon ui-icon-circle-triangle-e'][contains(text(),'Next')])[1]";
    this.entitlementSelect = "//select[@class='EntitlementType']";
    this.durationInput = "//input[contains(@class,'UserSpecifiedAbsenceDuration')]";
    this.createAbsenceButton = "(//span[text()='Create Absence'])[2]";
    this.confirmationNumberLink = "//a[@ng-context-menu='ConfirmationNumber']";
    this.editAbsenceButton = "//a/*[contains(text(),'Edit Absence')]";
    this.notesToAdministratorInput = "//textarea[@class='notes NotesToAdmin']";
    this.saveAbsenceButton = "//*[text()='Save Absence']";
    this.deleteAbsenceButton = "//*[contains(text(),'Delete')]";
    this.okButton = "//*[contains(text(),'Your Confirmation Number is')]//span[text()='Ok']";
    this.confirmationNumber = "//span[@class='confirmationNumber']";

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
   * @param {string} reason - The label of the entitlement option to select.
   * @param {string} duration - The absence duration value to enter.
   */
  async fillAbsenceDetails(reason, duration) {
    await this.page.locator(this.entitlementSelect).selectOption({ label: reason });
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

  /**
   * Clicks on the absence confirmation number.
   */
  async clickAbsenceConfirmationNumber() {
    await this.page.locator(this.confirmationNumberLink).click();
  }

  /**
   * Returns the absence confirmation number text.
   */
  async getAbsenceConfirmationNumber() {
    const el = this.page.locator(this.confirmationNumber).first();
    await el.waitFor({ state: 'visible', timeout: 10000 });
    return (await el.textContent()).trim();
  }

  /**
   * Clicks on the edit absence button.
   */
  async clickEditAbsence() {
    await this.page.waitForTimeout(2000);
    await this.page.locator(this.editAbsenceButton).first().click();
  }
  async clearAndUpdateNotesToAdministrator(newNotes) {
    const notesInput = this.page.locator(this.notesToAdministratorInput).first();
    await notesInput.fill('');
    await notesInput.fill(newNotes); 
  }
  async clickSaveAbsenceButton() {
    await this.page.locator(this.saveAbsenceButton).first().click();
    await this.page.waitForTimeout(2000); // Wait for the save action to complete
  } 
  
  async verifyNotesToAdministratorUpdated(expectedNotes) {
    const noteAfterUpdate = this.page.locator(`//textarea[@class='notes NotesToAdmin']/following-sibling::span[text()='${expectedNotes}']`).first();
    const actualNotes = await noteAfterUpdate.textContent();
    if (actualNotes !== expectedNotes) {
      throw new Error(`Expected notes to be "${expectedNotes}", but they were not found`);
    } else {
      console.log(`Notes to Administrator updated successfully with "${actualNotes}"`);
    }
  }
  
  async deleteAbsence() {
    await this.page.locator(this.deleteAbsenceButton).first().click();
    await this.page.waitForTimeout(2000); 
    await this.page.locator(this.deleteAbsenceButton).nth(2).click();
    await this.page.waitForTimeout(20000);

  }

  async clickOK(){
    await this.page.waitForTimeout(2000);
    await this.page.locator(this.okButton).first().click();
  }
}

module.exports = AbsenceCreatePage;