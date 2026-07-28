const BasePage = require('./basePage');

class Substitute_GeneralInformationPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.firstName = "//input[@id='substitutes.SUB_FirstName']";
    this.lastName = "//input[@id='substitutes.SUB_LastName']";
    this.email = "//input[@id='substitutes.SUB_email']";
    this.dateOfJoin = "//input[@id='substitutes.sub_doj']";
    this.birthDate = "//input[@id='substitutes.SUB_dob']";
    this.phone = "//input[@id='substitutes.sub_Phone']";
    this.pin = "//input[@id='substitutes.sub_Pin']";
    this.identifier = "//input[@id='substitutes.SUB_SSNum']";
    this.preferredSubstituteListsTab = "//a[text()='Preferred Substitute Lists']";
    this.addNewSchools = "//a[text()='Add New Schools']";
    this.applyChanges = "//input[@name='Apply']";

  }

  /**
   * Adds a new employee with the provided details.
   * @param {Object} details - Employee details object.
   * @param {string} details.firstName - Employee's first name.
   * @param {string} details.lastName - Employee's last name.
   * @param {string} details.email - Employee email address.
   * @param {string} details.dateOfJoin - Employment start date (MM/DD/YYYY).
   * @param {string} details.birthDate - Employee birth date (MM/DD/YYYY).
   * @param {string} details.phone - Employee phone number.
   * @param {string} details.pin - Employee PIN.
   * @param {string} details.identifier - Employee Identifier.
   * @param {string} details.School - School name to be added for the substitute.
   */
  async addSubstitute(details) {

  await this.page.locator(this.firstName).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.firstName).fill(details.firstName);

  await this.page.locator(this.lastName).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.lastName).fill(details.lastName);

  // Email
  await this.page.locator(this.email).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.email).fill(details.email);

  // Dates
  await this.page.locator(this.dateOfJoin).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.dateOfJoin).fill(details.dateOfJoin);

  await this.page.locator(this.birthDate).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.birthDate).fill(details.birthDate);

  // Phone & PIN
  await this.page.locator(this.phone).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.phone).fill(details.phone);

  await this.page.locator(this.pin).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.pin).fill(details.pin);

  // Identifier
  await this.page.locator(this.identifier).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.identifier).fill(details.identifier);

  // Submit
  await this.page.locator(this.applyChanges).first().click();

  await this.page.waitForTimeout(9000);
  
  await this.page.waitForTimeout(2000);
  await this.page.locator(this.preferredSubstituteListsTab).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.preferredSubstituteListsTab).click();
  await this.page.locator(this.addNewSchools).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator(this.addNewSchools).click();
  await this.page.waitForTimeout(2000);
  await this.page.locator(`//a[contains(text(),'${details.School}')]//ancestor::tr[1]//input[@class='CGP_deleted']`).click();
  await this.page.locator(this.applyChanges).first().click();

}
  
}
module.exports = Substitute_GeneralInformationPage;
