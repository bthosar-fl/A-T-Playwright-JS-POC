const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AbsenceReasonPage = require('../../pageObjects/absenceReasonPage');
const EmployeePage = require('../../pageObjects/employeePage');
const AbsenceCreatePage = require('../../pageObjects/absenceCreatePage');
const testData = require('../../test-data/createAbsenceTestData.json');

function getDateValue(value) {
  if (!value.startsWith('currentDate')) return value;

  const date = new Date();
  const offsetMatch = value.match(/^currentDate([+-]\d+)$/);
  if (offsetMatch) {
    date.setDate(date.getDate() + Number(offsetMatch[1]));
  }

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function getGenderValue(gender) {
  return gender.toLowerCase() === 'male' ? '1' : '2';
}

async function clickIfVisible(locator) {
  if (await locator.count()) {
    const firstLocator = locator.first();
    if (await firstLocator.isVisible()) {
      await firstLocator.click();
      return true;
    }
  }
  return false;
}

When('User create new react {string} with following {string} {string} and {string} {string}', async function (name, category, _separator, options, schoolLabel) {
  this.absenceReasonPage = new AbsenceReasonPage(this.page);
  await this.absenceReasonPage.clickAdd();
  await this.absenceReasonPage.createReason({
    name,
    schoolLabel: schoolLabel || testData.absenceReason.schoolLabel,
    comboboxValue: testData.absenceReason.comboboxValue || category,
    makePublic: options.includes('Public')
  });
  await this.absenceReasonPage.verifyReasonCreated(name);
});

Then('User navigate from {string} menu option to {string} sub menu to {string} through UI', async function (_menu, _submenu, tab) {
  this.employeePage = new EmployeePage(this.page);
  await this.employeePage.navigateToEmployeePage();

  const tabLink = this.page.getByRole('link', { name: tab });
  if (await tabLink.count()) {
    await tabLink.first().click();
  }
});

When('User creates react employee with {string} {string} {string} {string} {string} {string} {string} {string} {string} {string} {string} {string} {string} {string}', async function (empId, lastName, email, gender, startDate, endDate, birthDate, jobType, phone, pin, wktId, school, accountingCode, budgetCode) {
  this.employeePage = this.employeePage || new EmployeePage(this.page);
  await this.employeePage.addEmployee({
    firstName: empId,
    lastName,
    empId,
    email,
    gender: getGenderValue(gender),
    startDate,
    endDate,
    birthDate,
    jobType,
    phone,
    pin,
    wktId,
    listbox: testData.employee.listbox,
    homeInstId: testData.employee.homeInstId || school,
    accountingCode,
    budgetCode
  });
});

Then('user clicks the save button', async function () {
  const saveButton = this.page.getByRole('button', { name: /save|apply changes/i });
  const saveInput = this.page.locator('input[name="Apply"], input[value="Save"], input[value="Apply Changes"]');

  if (!(await clickIfVisible(saveButton))) {
    await clickIfVisible(saveInput);
  }
});

Then('User verify the Toast message for {string} {string} {string}', async function (_action, _entity, message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible({ timeout: 20000 });
});

Then('User clicks Absence Reason tab', async function () {
  await this.page.getByRole('link', { name: /Absence Reasons?/i }).click();
});

Then('User verifies the title of the react {string} page', async function (title) {
  await expect(this.page.getByText(title, { exact: false }).first()).toBeVisible({ timeout: 20000 });
});

Then('User verifies absence reason {string} is {string} under {string} tab', async function (reasonName, availability, _tabName) {
  const reason = this.page.getByText(reasonName, { exact: false });
  if (availability === 'available') {
    await expect(reason.first()).toBeVisible({ timeout: 20000 });
  } else {
    await expect(reason).toHaveCount(0, { timeout: 20000 });
  }
});

Then('User clicks Add Absence Reasons link on the absence reasons page', async function () {
  await this.page.getByRole('link', { name: /Add Absence Reasons?/i }).click();
});

Then('User includes the absence reason {string} in the selection', async function (reasonName) {
  const row = this.page.locator('tr').filter({ hasText: reasonName });
  const checkbox = row.locator('input[type="checkbox"]');
  if (await checkbox.count()) {
    await checkbox.first().check();
  } else {
    await this.page.getByText(reasonName, { exact: false }).click();
  }

  await clickIfVisible(this.page.getByRole('button', { name: /include|add|save/i }));
});

Then('User clicks return to Absence Reason tab', async function () {
  const returnLink = this.page.getByRole('link', { name: /return.*absence reason|absence reason/i });
  await returnLink.first().click();
});

Then('User verifies the grid fields on react Employee {string} Page', async function (_pageName, dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const expectedValue = getDateValue(row.value);
    await expect(this.page.getByText(expectedValue, { exact: false }).first()).toBeVisible({ timeout: 20000 });
  }
});

Then('User {string} Absence reason balance {string} and Exisitng balance {string} with as Of date {string}', async function (action, initialBalance, existingBalance, asOfDate) {
  await clickIfVisible(this.page.getByRole('button', { name: new RegExp(action, 'i') }));
  await clickIfVisible(this.page.getByRole('link', { name: new RegExp(action, 'i') }));

  const numericInputs = this.page.locator('input[type="text"], input[type="number"]');
  const inputCount = await numericInputs.count();

  if (inputCount > 0) {
    await numericInputs.nth(0).fill(initialBalance);
  }

  if (inputCount > 1) {
    await numericInputs.nth(1).fill(existingBalance);
  }

  const dateInput = this.page.locator('input[type="date"], input[name*="date" i], input[id*="date" i]').first();
  if (await dateInput.count()) {
    await dateInput.fill(getDateValue(asOfDate));
  }

  await clickIfVisible(this.page.getByRole('button', { name: /save|apply/i }));
});

Then('User navigate from {string} menu option to {string} through UI', async function (menu, submenu) {
  if (menu === 'Absences' && submenu === 'Create Absence') {
    this.absenceCreatePage = new AbsenceCreatePage(this.page);
    await this.absenceCreatePage.navigateToCreateAbsence();
    return;
  }

  await this.page.getByRole('menuitem', { name: menu }).click();
  await this.page.getByRole('link', { name: new RegExp(submenu, 'i') }).click();
});

Then('User Select {string} and click on fillOutDetalis', async function (employeeName) {
  await this.page.getByText(employeeName, { exact: false }).click();
  await clickIfVisible(this.page.getByRole('button', { name: /fill.*details/i }));
  await clickIfVisible(this.page.getByRole('link', { name: /fill.*details/i }));
});

Then('User switch to Day View', async function () {
  await clickIfVisible(this.page.getByRole('link', { name: /day view/i }));
  await clickIfVisible(this.page.getByRole('button', { name: /day view/i }));
});

Then('User create Absence in Viewby Day Page {string} to {string} for {string} {string} and {string}', async function (startDate, endDate, reason, duration, accountingCode) {
  const startInput = this.page.locator('input[name*="start" i], input[id*="start" i]').first();
  const endInput = this.page.locator('input[name*="end" i], input[id*="end" i]').first();

  if (await startInput.count()) {
    await startInput.fill(getDateValue(startDate));
  }

  if (await endInput.count()) {
    await endInput.fill(getDateValue(endDate));
  }

  const reasonSelect = this.page.locator('select').first();
  if (await reasonSelect.count()) {
    await reasonSelect.selectOption({ label: reason }).catch(async () => reasonSelect.selectOption({ index: 1 }));
  }

  const durationInput = this.page.locator('input[class*="duration" i], input[name*="duration" i], input[id*="duration" i]').first();
  if (await durationInput.count()) {
    await durationInput.fill(duration);
  }

  const accountingSelect = this.page.locator('select').filter({ hasText: accountingCode }).first();
  if (await accountingSelect.count()) {
    await accountingSelect.selectOption({ label: accountingCode });
  }
});

Then('User enter  details {string} to {string} and {string}', async function (note, substituteNote, adminNote) {
  const textareas = this.page.locator('textarea');
  const values = [note, substituteNote, adminNote];

  for (let index = 0; index < values.length; index += 1) {
    if (await textareas.nth(index).count()) {
      await textareas.nth(index).fill(values[index]);
    }
  }
});

Then('User verify Absence is created successfully', async function () {
  await clickIfVisible(this.page.getByRole('button', { name: /create absence|save|submit/i }));
  await expect(this.page.getByText(/created|success|confirmation/i).first()).toBeVisible({ timeout: 30000 });
});

Then('User searches the Employee with {string} {string}', async function (_fieldName, searchValue) {
  this.employeePage = this.employeePage || new EmployeePage(this.page);
  await this.employeePage.searchEmployee(searchValue);
});

Then('User clicks on {string} tab', async function (tabName) {
  await this.page.getByRole('link', { name: new RegExp(tabName, 'i') }).click();
});

Then('User clicks edit button on the absence reason tab', async function () {
  await clickIfVisible(this.page.getByRole('button', { name: /edit/i }));
  await clickIfVisible(this.page.getByRole('link', { name: /edit/i }));
});

Then('User select {string} for absence reason removal', async function (reasonName) {
  const row = this.page.locator('tr').filter({ hasText: reasonName });
  const checkbox = row.locator('input[type="checkbox"]');
  if (await checkbox.count()) {
    await checkbox.first().check();
  } else {
    await this.page.getByText(reasonName, { exact: false }).click();
  }
});

Then('User saves the updated absence reasons list after removal', async function () {
  await clickIfVisible(this.page.getByRole('button', { name: /remove|save|apply/i }));
  await clickIfVisible(this.page.getByRole('link', { name: /remove|save|apply/i }));
});

Then('User navigate to {string}', async function (target) {
  await this.page.getByText(target, { exact: false }).click();
});

When('User search the absence with the {string}', async function (confirmationKey) {
  const searchValue = this[confirmationKey] || confirmationKey;
  const searchInput = this.page.locator('input[type="text"], input[type="search"]').first();
  await searchInput.fill(searchValue);
  await clickIfVisible(this.page.getByRole('button', { name: /go|search|find/i }));
});

When('User delete the React absence or vacancy', async function () {
  this.page.once('dialog', async (dialog) => dialog.accept());
  await clickIfVisible(this.page.getByRole('button', { name: /delete|remove/i }));
  await clickIfVisible(this.page.getByRole('link', { name: /delete|remove/i }));
});

When('User deletes the Employee having {string} {string}', async function (_fieldName, searchValue) {
  this.employeePage = this.employeePage || new EmployeePage(this.page);
  await this.employeePage.searchEmployee(searchValue);
  await this.page.getByText(searchValue, { exact: false }).click();
  this.page.once('dialog', async (dialog) => dialog.accept());
  await clickIfVisible(this.page.getByRole('button', { name: /delete|remove/i }));
  await clickIfVisible(this.page.getByRole('link', { name: /delete|remove/i }));
});
