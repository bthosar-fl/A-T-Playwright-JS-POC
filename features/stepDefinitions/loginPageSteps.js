const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../../pageObjects/loginPage');
const ImpersonationPage = require('../../pageObjects/impersonationPage');
const testData = require('../../test-data/createAbsenceTestData.json');

Given('Application is open in the browser', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto(testData.login.url);
});

When('User logs in using {string} and {string}', async function (userKey, passKey) {
  await this.loginPage.loginToApp(testData.login[userKey], testData.login[passKey]);
});

Then('User is logged in successfully and is redirected to application homepage', async function () {
  await this.page.getByRole('menuitem', { name: 'Reference Data' }).waitFor({ state: 'visible', timeout: 20000 });
});

Then('User Impersonate as Employee', async function () {
  const linkName = `${testData.employee.lastName}, ${testData.employee.firstName}`;
  await this.page.getByRole('link', { name: linkName }).click();
  this.impersonationPage = new ImpersonationPage(this.page);
  await this.impersonationPage.impersonateUser();
});

Then('User Impersonate as Employee as firstName {string} and lastName {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).click();
  this.impersonationPage = new ImpersonationPage(this.page);
  await this.impersonationPage.impersonateUser();
  await this.page.waitForTimeout(20000);
});

Then('User End the Impersonation', async function () {
  this.impersonationPage = new ImpersonationPage(this.page);
  await this.impersonationPage.endImpersonation();
});
