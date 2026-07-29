const { Given, When, Then } = require('@cucumber/cucumber');
const employeeGeneralInfoPage = require('../../pageObjects/employee_GeneralInformationPage');

When('user creates employee with these details', async function (dataTable) {
  // Check if employee exis
  const details = dataTable.rowsHash();
  this.employeeGeneralInfoPage = new employeeGeneralInfoPage(this.page);
  
  // Helper function to generate random number with specific length
  const generateRandomNumber = (length) => {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };
  
  // Generate random values if specified as "RANDOM"
  const phone = details.phone === 'RANDOM' ? generateRandomNumber(10) : details.phone;
  const pin = details.pin === 'RANDOM' ? generateRandomNumber(5) : details.pin;
  
  await this.employeeGeneralInfoPage.addEmployee({
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
      phone: phone,
      pin: pin
    });
    
});

Then('Employee is created successfully with first name {string} and last name {string}', async function (firstName, lastName) {
  const linkName = `${lastName}, ${firstName}`;
  await this.page.getByRole('link', { name: linkName }).waitFor({ state: 'visible', timeout: 20000 });
});


When('User search for employee with last name as {string}', async function (lastName) {
  this.employeeGeneralInfoPage = new employeeGeneralInfoPage(this.page);
  await this.employeeGeneralInfoPage.searchEmployee(lastName);
});

Then('User delete employee if exist for user last name {string}', async function (lastName) {
  this.employeeGeneralInfoPage = new employeeGeneralInfoPage(this.page);
  await this.employeeGeneralInfoPage.searchAndDeleteEmployee(lastName);
});




