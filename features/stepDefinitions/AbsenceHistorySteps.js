const { Given, When, Then } = require('@cucumber/cucumber');
const AbsenceHistoryPage = require('../../pageObjects/absenceHistoryPage');

Then('User delete absence if exist for user last name {string}', async function (lastName) {
  this.absenceHistoryPage = new AbsenceHistoryPage(this.page);
  await this.absenceHistoryPage.searchAndDeleteAbsence(lastName);
});