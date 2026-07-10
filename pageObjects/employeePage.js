const BasePage = require('./basePage');
const AbsenceCreatePage = require('./absenceCreatePage');
const { HomePage } = require('./homePage');

class EmployeePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchEmployeeTextBox = "//input[@id='mask']";
    this.goButton = "//input[@type='submit']";
    this.removeButton = "//input[@name='Remove']";
    this.absenceRequestErrorButton = "//em[contains(text(),'Before you can delete this Employee ')]";
    this.allConfNumOfUnfillAbsence = "//em[text()='UnFilled']//parent::td//parent::tr//a[contains(@href,'absencemodify') and @class='ctx']";
    this.deleteEmployeeSuccessMsg = "//em[text()='This Employee has been deleted.']";
  }

  /**
   * Navigates to the Employee Master Data page.
   */
  async navigateToEmployeePage() {
    await this.page.getByRole('menuitem', { name: 'Master Data' }).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.getByRole('menuitem', { name: 'Master Data' }).hover();
    await this.page.getByRole('menuitem', { name: 'Master Data' }).click();
    await this.page.goto('https://aesstage.flqa.net/navigator/te_general.asp?TB2=TAB1&TB1=TAB1', { waitUntil: 'networkidle' });
  }

  /**
   * Searches for an employee using the given mask/filter text.
   * @param {string} mask - The search term to filter employees.
   */
  async searchEmployee(mask) {
    await this.page.locator('#mask').waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator('#mask').click();
    await this.page.locator('#mask').fill(mask);
    await this.page.getByRole('button', { name: 'Go' }).click();
  }

  /**
   * Adds a new employee with the provided details.
   * @param {Object} details - Employee details object.
   * @param {string} details.firstName - Employee's first name.
   * @param {string} details.lastName - Employee's last name.
   * @param {string} details.empId - Employee ID.
   * @param {string} details.wktId - Worker type ID for dropdown selection.
   * @param {string} details.listbox - Listbox option value.
   * @param {string} details.homeInstId - Home institution ID.
   * @param {string} details.email - Employee email address.
   * @param {string} details.gender - Employee gender value.
   * @param {string} details.startDate - Employment start date (MM/DD/YYYY).
   * @param {string} details.endDate - Employment end date (MM/DD/YYYY).
   * @param {string} details.birthDate - Employee birth date (MM/DD/YYYY).
   * @param {string} details.phone - Employee phone number.
   * @param {string} details.pin - Employee PIN.
   */
  async addEmployee(details) {
  await this.page.getByRole('link', { name: 'Add Employee' }).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.getByRole('link', { name: 'Add Employee' }).click();

  await this.page.locator('[id="worker.WORK_FirstName"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_FirstName"]').fill(details.firstName);

  await this.page.locator('[id="worker.WORK_LastName"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_LastName"]').fill(details.lastName);

  await this.page.locator('[id="worker.work_EmpID"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.work_EmpID"]').fill(details.empId);

  // Worker Type (jobType) dropdown
  await this.page.locator('select[name="worker.wkt_ID"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('select[name="worker.wkt_ID"]').selectOption(details.wktId);

  // Listbox
  await this.page.getByRole('listbox').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.getByRole('listbox').selectOption(details.listbox);

  // Home Institution
  await this.page.locator('select[name="worker.work_homeInstId"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('select[name="worker.work_homeInstId"]').selectOption(details.homeInstId);

  // Email
  await this.page.locator('[id="worker.work_email"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.work_email"]').fill(details.email);

  // Gender
  await this.page.locator('select[name="worker.work_Sex"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('select[name="worker.work_Sex"]').selectOption(details.gender);

  // Dates
  await this.page.locator('[id="worker.WORK_EmployStartDate"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_EmployStartDate"]').fill(details.startDate);

  await this.page.locator('[id="worker.WORK_EmployEndDate"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_EmployEndDate"]').fill(details.endDate);

  await this.page.locator('[id="worker.WORK_BirthDate"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_BirthDate"]').fill(details.birthDate);

  // Phone & PIN
  await this.page.locator('[id="worker.WORK_Phone"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.WORK_Phone"]').fill(details.phone);

  await this.page.locator('[id="worker.work_Pin"]').waitFor({ state: 'visible', timeout: 20000 });
  await this.page.locator('[id="worker.work_Pin"]').fill(details.pin);

  // Submit
  await this.page.getByRole('cell', {
    name: 'Apply Changes Cancel Fields marked with an asterisk * are required.',
    exact: true
  }).locator('input[name="Apply"]').click();
}

  /**
   * Logs in as the currently selected user via impersonation link.
   */
  async loginAsUser() {
    await this.getByRole('link', { name: 'Log in as User' }).click();
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
        this.absenceCreatePage = new AbsenceCreatePage(this.page);
        await this.absenceCreatePage.deleteAbsence();
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
  
  async searchAndDeleteEmployee(lastName){
    const searchLocator = this.page.locator(this.searchEmployeeTextBox);
    await searchLocator.waitFor({ state: 'visible', timeout: 20000 });
    await searchLocator.fill(lastName);
    await this.page.locator(this.goButton).click();
    // Check if remove button exists before proceeding
    const removeButtonLocator = await this.page.locator(this.removeButton).first();
    const isRemoveButtonVisible = await removeButtonLocator.isVisible();
    if (isRemoveButtonVisible) {
      const removeBtn = this.page.locator(this.removeButton).first();
      await removeBtn.waitFor({ state: 'visible', timeout: 20000 });
      await removeBtn.scrollIntoViewIfNeeded();
      
      // Set up dialog handler BEFORE clicking remove button (since click triggers the alert)
      this.page.once('dialog', async dialog => {
        console.log(dialog.message()); // Optional: logs the alert text
        await dialog.accept();         // Simulates clicking "OK"
      });
      
      await removeBtn.click();
      await this.page.waitForTimeout(2000);
      await this.page.locator(this.deleteEmployeeSuccessMsg).waitFor({ state: 'visible', timeout: 20000 });
    }
  }
}
module.exports = EmployeePage;
