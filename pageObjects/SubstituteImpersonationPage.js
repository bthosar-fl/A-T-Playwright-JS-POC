const BasePage = require('./basePage');

class SubstituteImpersonationPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.assignmentAcceptConfirmation = "//div[contains(text(),'Assignment Accepted.  Your confirmation number is')]";
  }
  async acceptJob(lastName) {
    await this.page.waitForTimeout(3000);
    await this.page.locator(`//span[contains(text(),'${lastName}')]/parent::div/following-sibling::div//a[contains(@class,'acceptButton')]`).click();
    await this.page.waitForTimeout(3000); 
    await this.page.locator(this.assignmentAcceptConfirmation).waitFor({ state: 'visible', timeout: 10000 });
  }
}
module.exports = SubstituteImpersonationPage;
