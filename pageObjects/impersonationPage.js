const BasePage = require('./basePage');

class ImpersonationPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginAsUserLink = page.getByRole('link', { name: 'Log in as User' });
    this.exitButton = "//button[@class='sk--impersonation-exit fa-li-close']";
  }

  /**
   * Impersonates the selected user by clicking the login-as-user link and waiting for navigation.
   */
  async impersonateUser() {
    await this.loginAsUserLink.waitFor({ state: 'visible', timeout: 20000 });
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
      this.loginAsUserLink.click()
    ]);
    await this.page.waitForSelector(this.exitButton, { state: 'visible', timeout: 20000 });
  }

  /**
   * Ends the current impersonation session by clicking the exit button.
   */
  async endImpersonation() {
    await this.page.locator(this.exitButton).click();
  }
}

module.exports = ImpersonationPage;