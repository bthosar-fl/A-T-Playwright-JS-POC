const { Given, When, Then } = require('@cucumber/cucumber');
const SubstituteImpersonationPage = require('../../pageObjects/SubstituteImpersonationPage');

Then('Accept the job where lastname is {string}', async function (lastName) {
  const substituteImpersonationPage = new SubstituteImpersonationPage(this.page);
  await substituteImpersonationPage.acceptJob(lastName);
});

