const BasePage = require('./basePage');

class Employee_GeneralInformationPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageTitle = '//span[@title="Employee Search"]',
    this.searchTextBox = "//form[@name='search']//input[@type='text']";
    this.goButton = "//form[@name='search']//input[@type='submit']";
    this.searchEmployeeTextBox = "//input[@id='mask' or @name='mask']";
    this.removeButton = "//input[@name='Remove']";
    this.absenceRequestErrorButton = "//em[contains(text(),'Before you can delete this Employee ')]";
    this.allConfNumOfUnfillAbsence = "//em[text()='UnFilled' or text()='Filled']//parent::td//parent::tr//a[contains(@href,'absencemodify') and @class='ctx']";
    this.deleteEmployeeSuccessMsg = "//em[text()='This Employee has been deleted.']";
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

    await this.page.waitForTimeout(9000); // Wait for 2 seconds before proceeding
}

async searchEmployee(lastName) {

    await this.page.locator(this.searchTextBox).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator(this.searchTextBox).fill(lastName);
    // Click on the search button
    await this.page.locator(this.goButton).click();
    await this.page.waitForTimeout(5000); // Wait for 5 seconds before proceeding
}

async searchAndDeleteEmployee(lastName){
    const searchLocator = this.page.locator(this.searchEmployeeTextBox);
    await searchLocator.waitFor({ state: 'visible', timeout: 20000 });
    await searchLocator.fill(lastName);
    await this.page.locator(this.goButton).click();
    await this.page.waitForTimeout(3000); // Wait for 3 seconds before proceeding

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
       await this.page.waitForTimeout(2000);
      await removeBtn.click();
      await this.page.waitForTimeout(2000);
      await this.page.locator(this.deleteEmployeeSuccessMsg).waitFor({ state: 'visible', timeout: 20000 });
    }
  }

  async verifyPageTitle(pageTitle) {
    const selector = `xpath=(//span[text()="${pageTitle}"] | //*[@title="${pageTitle}"])`;
    const locator = this.page.locator(selector).first();
    await locator.waitFor({ state: 'visible', timeout: 20000 });

    let actual = '';
    try {
      actual = (await locator.innerText()).trim();
    } catch (e) {
      actual = '';
    }

    if (!actual) {
      try {
        const titleAttr = await locator.getAttribute('title');
        if (titleAttr) actual = titleAttr.trim();
      } catch (e) {
        // ignore
      }
    }

    if (actual !== pageTitle) {
      throw new Error(`Expected page title to be "${pageTitle}", but got "${actual}"`);
    }
}


}
module.exports = Employee_GeneralInformationPage;
