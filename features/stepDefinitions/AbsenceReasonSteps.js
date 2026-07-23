const { Given, When, Then } = require('@cucumber/cucumber');
const AbsenceReasonPage = require('../../pageObjects/absenceReasonPage');
const testData = require('../../test-data/createAbsenceTestData.json');

When('User Create new absence reason as {string} with following {string} {string} and {string}', async function (name, category, _separator, visibility) {
  this.absenceReasonPage = new AbsenceReasonPage(this.page);
  await this.absenceReasonPage.deleteReason(name); 
  await this.absenceReasonPage.clickAdd();
  await this.absenceReasonPage.createReason({
    name,
    schoolLabel: testData.absenceReason.schoolLabel,
    comboboxValue: testData.absenceReason.comboboxValue,
    makePublic: visibility === 'Public to Employee'
  });
  await this.absenceReasonPage.verifyReasonCreated(name);
});