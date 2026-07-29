const { Given, When, Then } = require('@cucumber/cucumber');
const substituteGeneralInfoPage = require('../../pageObjects/substitute_GeneralInformationPage');

When('user creates substitute with these details', async function (dataTable) {
  const details = dataTable.rowsHash();
  this.substituteGeneralInfoPage = new substituteGeneralInfoPage(this.page);
  
  // Helper function to generate random number with specific length
  const generateRandomNumber = (length) => {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };
  
  // Generate random values if specified as "RANDOM"
  const phone = details.phone === 'RANDOM' ? generateRandomNumber(10) : details.phone;
  const pin = details.pin === 'RANDOM' ? generateRandomNumber(5) : details.pin;
  const identifier = details.identifier === 'RANDOM' ? generateRandomNumber(5) : details.identifier;
  
  await this.substituteGeneralInfoPage.addSubstitute({
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      dateOfJoin: details.dateOfJoin,
      birthDate: details.birthDate,
      phone: phone,
      pin: pin,
      identifier: identifier,
      School: details.School,
    });
    
});

Then('Substitute is created successfully with first name {string} and last name {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: 20000 });
});
