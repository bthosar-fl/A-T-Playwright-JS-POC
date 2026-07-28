const BasePage = require('./basePage');
const AbsenceCreatePage = require('./absenceCreatePage');
const HomePage = require('./webNavigatorPage');

class AbsenceHistoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchEmployeeTextBox = "//input[@id='mask']";
    this.goButton = "//input[@type='submit']";
    this.allConfNumOfUnfillAbsence = "//em[text()='UnFilled']//parent::td//parent::tr//a[contains(@href,'absencemodify') and @class='ctx']";
    this.deleteAbsenceButton = "//*[contains(text(),'Delete')]";

  }

   async deleteAbsence() {
    await this.page.locator(this.deleteAbsenceButton).first().click();
    await this.page.waitForTimeout(2000); 
    await this.page.locator(this.deleteAbsenceButton).nth(2).click();
    await this.page.waitForTimeout(2000);
  }

  async searchAndDeleteAbsence(lastName){
    const searchLocator = this.page.locator(this.searchEmployeeTextBox);
    await searchLocator.waitFor({ state: 'visible', timeout: 20000 });
    await searchLocator.fill(lastName);
    await this.page.locator(this.goButton).click();
    // Capture all the absence id element and iterate in a loop
    const context = this.page.context();
    // Check if allConfNumOfUnfillAbsence locator exists before proceeding
    const elements = await this.page.locator(this.allConfNumOfUnfillAbsence).elementHandles();
    if (elements.length > 0) {
      const confAbsenceList = await this.page.locator(this.allConfNumOfUnfillAbsence).all();
      for (let i = 0; i < confAbsenceList.length; i++) {
        await  this.page.locator(this.allConfNumOfUnfillAbsence).first().click();
        await this.page.waitForTimeout(2000);
        await this.deleteAbsence();
        await this.page.waitForTimeout(2000);
        for (let i = 0; i < confAbsenceList.length-1; i++) {
          this.homePage = new HomePage(this.page);
          await this.homePage.navigateToSubMenu('Master Data', 'Employee', 'Absence History');
          const searchLocator = this.page.locator(this.searchEmployeeTextBox);
          await searchLocator.waitFor({ state: 'visible', timeout: 20000 });
          await searchLocator.fill(lastName);
          await this.page.locator(this.goButton).click();
          await this.page.waitForTimeout(2000);
        }
      }
    }
  } 
}
module.exports = AbsenceHistoryPage;
