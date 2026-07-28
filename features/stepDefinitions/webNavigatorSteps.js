
const { Given, When, Then } = require('@cucumber/cucumber');
const { WebNavigatorPage } = require('../../pageObjects/webNavigatorPage');


Then('User navigate from {string} menu option to {string} sub menu to {string}', async function (menu, submenu, tab) {
  this.webNavigatorPage = new WebNavigatorPage(this.page);
  await this.webNavigatorPage.navigateToSubMenu(menu, submenu, tab);
});