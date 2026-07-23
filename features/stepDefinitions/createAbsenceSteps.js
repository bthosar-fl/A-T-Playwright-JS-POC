const { Given, When, Then } = require('@cucumber/cucumber');
const AbsenceCreatePage = require('../../pageObjects/absenceCreatePage');

Then('User Clicks on the Day Picker and Select Date as {string}', async function (dayIndex) {
  this.absenceCreatePage = new AbsenceCreatePage(this.page);
  await this.absenceCreatePage.selectDate(parseInt(dayIndex));
});

Then('Employee Create new absence with following {string} {string}', async function (reason, duration) {
  this.absenceCreatePage = new AbsenceCreatePage(this.page);
  await this.absenceCreatePage.fillAbsenceDetails(reason, duration);
});

Then('User Will click on Create Absence button', async function () {
  this.absenceCreatePage = new AbsenceCreatePage(this.page);
  await this.absenceCreatePage.submitAbsence();
});

Then('User click on ok button in confirmation pop-up', async function () {
  await this.absenceCreatePage.clickOK();
});




