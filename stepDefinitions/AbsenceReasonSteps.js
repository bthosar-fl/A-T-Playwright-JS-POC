const { Given, When, Then } = require('@cucumber/cucumber');
const AbsenceReasonPage = require('../pageObjects/absenceReasonPage');
const { getConfig } = require('../Smoke-Navigation-Flow/Runners/navigationSmokeRuntime');

When('User Create new absence reason as {string} with following {string} {string} and {string}', async function (name, category, _separator, visibility) {
  this.absenceReasonPage = new AbsenceReasonPage(this.page);
  await this.absenceReasonPage.deleteReason(name); 
  await this.absenceReasonPage.clickAdd();
  const reasonData = getConfig().absenceReason || {};
  await this.absenceReasonPage.createReason({
    name,
    schoolLabel: reasonData.schoolLabel,
    comboboxValue: reasonData.comboboxValue || category,
    makePublic: visibility === 'Public to Employee'
  });
  await this.absenceReasonPage.verifyReasonCreated(name);
});
