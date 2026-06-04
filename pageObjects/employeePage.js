const BasePage = require('./basePage');

class EmployeePage extends BasePage {
  constructor(page) {
    super(page);
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
}

module.exports = EmployeePage;
