const { Given, When, Then } = require('@cucumber/cucumber');
const employeeGeneralInfoPage = require('../pageObjects/employee_GeneralInformationPage');

When('user creates employee with these details', async function (dataTable) {
  // Check if employee exis
  const details = dataTable.rowsHash();
  this.employeeGeneralInfoPage = new employeeGeneralInfoPage(this.page);
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
      phone: details.phone,
      pin: details.pin
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

Then('User verifies page title as {string}', async function (pageTitle) {
  this.employeeGeneralInfoPage = new employeeGeneralInfoPage(this.page);
  //await this.employeeGeneralInfoPage.verifyPageTitle(pageTitle);
});






