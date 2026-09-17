const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../pageObjects/loginPage');
const ImpersonationPage = require('../pageObjects/impersonationPage');
const { getCredentials, getConfig } = require('../Smoke-Navigation-Flow/Runners/smokeRuntime');

Given('Application is open in the browser', async function () {
  this.loginPage = new LoginPage(this.page);
  const { url } = getConfig();
  console.log(`[Smoke] Opening URL: ${url}`);
  const response = await this.loginPage.goto(url);
  console.log(`[Smoke] Loaded URL: ${this.page.url()}${response ? ` (${response.status()})` : ''}`);
});

When('User logs in using {string} and {string}', async function (userKey, _passwordKey) {
  const key = userKey || process.env.SMOKE_USER;
  console.log(`[Smoke] Step: User logs in using (two-arg) userKey="${key}"`);
  const credentials = getCredentials(key);
  console.log(`[Smoke] Step: calling loginToApp for "${credentials.username}"`);
  await this.loginPage.loginToApp(credentials.username, credentials.password);
});

When('User logs in using {string}', async function (userKey) {
  const key = userKey || process.env.SMOKE_USER;
  console.log(`[Smoke] Step: User logs in using userKey="${key}"`);
  const credentials = getCredentials(key);
  console.log(`[Smoke] Step: calling loginToApp for "${credentials.username}"`);
  await this.loginPage.loginToApp(credentials.username, credentials.password);
});

Then('User is logged in successfully and is redirected to application homepage', async function () {
  //await this.page.getByRole('menuitem', { name: 'Reference Data' }).waitFor({ state: 'visible', timeout: 20000 });
  await this.page.waitForSelector("//*[contains(text(),'Absence Management')]", { state: 'visible', timeout: 20000 });
});

Then('User Impersonate as Employee', async function () {
  const employee = getConfig().impersonationEmployee;
  if (!employee?.firstName || !employee?.lastName) {
    throw new Error('Add impersonationEmployee.firstName and impersonationEmployee.lastName to the selected smoke config.');
  }
  const linkName = `${employee.lastName}, ${employee.firstName}`;
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
