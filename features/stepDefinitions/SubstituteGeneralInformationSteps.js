const { Given, When, Then } = require('@cucumber/cucumber');
const substituteGeneralInfoPage = require('../../pageObjects/substitute_GeneralInformationPage');

When('user creates substitute with these details', async function (dataTable) {
  const details = dataTable.rowsHash();
  this.substituteGeneralInfoPage = new substituteGeneralInfoPage(this.page);
   await this.substituteGeneralInfoPage.addSubstitute({
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      dateOfJoin: details.dateOfJoin,
      birthDate: details.birthDate,
      phone: details.phone,
      pin: details.pin,
      identifier: details.identifier,
      School: details.School,
    });
    
});

Then('Substitute is created successfully with first name {string} and last name {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: 20000 });
});
