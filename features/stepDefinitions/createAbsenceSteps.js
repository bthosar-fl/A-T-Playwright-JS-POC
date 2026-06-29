const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../../pageObjects/loginPage');
const AbsenceReasonPage = require('../../pageObjects/absenceReasonPage');
const EmployeePage = require('../../pageObjects/employeePage');
const AbsenceCreatePage = require('../../pageObjects/absenceCreatePage');
const ImpersonationPage = require('../../pageObjects/impersonationPage');
const testData = require('../../test-data/createAbsenceTestData.json');

Given('Application is open in the browser', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto(testData.login.url);
});

When('User logs in using {string} and {string}', async function (userKey, passKey) {
  const username = testData.login[userKey] || testData.login.appUsername;
  const password = testData.login[passKey] || testData.login.appPassword;
  await this.loginPage.loginToApp(username, password);
});

Then('User is logged in successfully and is redirected to application homepage', async function () {
  await this.page.getByRole('menuitem', { name: 'Reference Data' }).waitFor({ state: 'visible', timeout: 20000 });
});

Then('User navigate from {string} menu option to {string}', async function (menu, submenu) {
  if (menu === 'Reference Data' && submenu === 'Absence Reason') {
    this.absenceReasonPage = new AbsenceReasonPage(this.page);
    await this.absenceReasonPage.open();
  } else if (menu === 'Absences' && submenu === 'Create Absence') {
    this.absenceCreatePage = new AbsenceCreatePage(this.page);
    await this.absenceCreatePage.navigateToCreateAbsence();
  } else if (menu === 'Absences' && submenu === 'Modify') {
    await this.page.getByRole('menuitem', { name: 'Absences' }).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.getByRole('menuitem', { name: 'Absences' }).click();
    await this.page.getByRole('link', { name: /Modify/i }).click();
  }
});

When('User Create new {string} with following {string} {string} and {string}', async function (name, category, _separator, visibility) {
  await this.absenceReasonPage.deleteReason(name); 
  this.page.pause();
  await this.absenceReasonPage.clickAdd();
  await this.absenceReasonPage.createReason({
    name,
    schoolLabel: testData.absenceReason.schoolLabel,
    comboboxValue: testData.absenceReason.comboboxValue,
    makePublic: visibility === 'Public to Employee'
  });
  await this.absenceReasonPage.verifyReasonCreated(name);
});

Then('User Logout from application and logged in again with {string} {string}', async function (userKey, passKey) {
  await this.loginPage.logout();
  await this.loginPage.loginToApp(testData.login[userKey], testData.login[passKey]);
});

Then('User navigate from {string} menu option to {string} sub menu to {string}', async function (menu, submenu, tab) {
  this.employeePage = new EmployeePage(this.page);
  await this.employeePage.navigateToEmployeePage();
  await this.employeePage.searchEmployee('A');
  await this.page.getByRole('link', { name: 'General Information' }).click();
});

When('user creates employee with required details', async function () {
  
  await this.employeePage.addEmployee({
    firstName: testData.employee.firstName,
    lastName: testData.employee.lastName,
    empId: testData.employee.empId,
    wktId: testData.employee.wktId,
    listbox: testData.employee.listbox,
    homeInstId: testData.employee.homeInstId,
    email: testData.employee.email,
    gender: testData.employee.gender === 'Male' ? '1' : '2',
    startDate: testData.employee.startDate,
    endDate: testData.employee.endDate,
    birthDate: testData.employee.birthDate,
    jobType: testData.employee.jobType,
    phone: testData.employee.phone,
    pin: testData.employee.pin
  });
});

Then('Employee is created successfully', async function () {
  const linkName = `${testData.employee.lastName}, ${testData.employee.firstName}`;
  await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: 20000 });
});

Then('User Impersonate as Employee', async function () {
  const linkName = `${testData.employee.lastName}, ${testData.employee.firstName}`;
  await this.page.getByRole('link', { name: linkName }).click();
  this.impersonationPage = new ImpersonationPage(this.page);
  await this.impersonationPage.impersonateUser();
});

Then('User Clicks on the Day Picker and Select Date as {string}', async function (dayIndex) {
  await this.absenceCreatePage.selectDate(parseInt(dayIndex));
});

Then('Employee Create new absence with following {string} {string}', async function (reason, duration) {
  await this.absenceCreatePage.fillAbsenceDetails(reason, duration);
});

Then('User Will click on Create Absence button', async function () {
  await this.absenceCreatePage.submitAbsence();
});

Then('Absence is created with the reason', async function () {
  // Dialog acceptance in submitAbsence() confirms creation
});

Then('User End the Impersonation', async function () {
  await this.impersonationPage.endImpersonation();
});
When('user creates employee with these details', async function (dataTable) {
  const details = dataTable.rowsHash();
   await this.employeePage.addEmployee({
      firstName: details.firstName,
      lastName: details.lastName,
      empId: details.empId,
      wktId: details.wktId,
      listbox: details.listbox,
      homeInstId: details.homeInstId,
      email: details.email,
      gender: details.gender === 'Male' ? '1' : '2',
      startDate: details.startDate,
      endDate: details.endDate,
      birthDate: details.birthDate,
      jobType: details.jobType,
      phone: details.phone,
      pin: details.pin
    });
    
});


When('User click on the absence confirmation number', async function () {
  await this.absenceCreatePage.clickAbsenceConfirmationNumber();
});

When('User Click on edit absence', async function () {
  await this.absenceCreatePage.clickEditAbsence();
});

When('User clear the Notes to Administrator and update as {string}', async function (newNotes) {
  await this.absenceCreatePage.clearAndUpdateNotesToAdministrator(newNotes);
});

When('User click on save absence button', async function () {
  await this.absenceCreatePage.clickSaveAbsenceButton();
});

When('Verify that the Notes to Administrator is updated successfully with {string}', async function (expectedNotes) {
  await this.absenceCreatePage.verifyNotesToAdministratorUpdated(expectedNotes);
});

Then('Delete the absence created by the employee', async function () {
  await this.absenceCreatePage.deleteAbsence();
});

Then('Employee is created successfully with first name {string} and last name {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: 20000 });
});

Then('User Impersonate as Employee as firstName {string} and lastName {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).click();
  this.impersonationPage = new ImpersonationPage(this.page);
  await this.impersonationPage.impersonateUser();
});

Then('User click on ok button in confirmation pop-up', async function () {
  await this.absenceCreatePage.clickOK();
});

When('User close the Impersonate as Employee page', async function (){
  await this.impersonationPage.endImpersonation();
});

Then ('User capture the absence confirmation number', async function(){
    // capture confirmation number for later use
  this.absenceConfirmationNumber = await this.absenceCreatePage.getAbsenceConfirmationNumber();
});
