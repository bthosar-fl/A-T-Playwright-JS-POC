class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@id="input27"]');
    this.passwordInput = page.locator('//input[@name="credentials.passcode"]');
    this.nextButton = page.locator("//input[@value='Next']");
    this.signInButton = page.locator("//input[@value='Verify']");
    this.userInfoButton = "//button[contains(@id,'user-info-title')]";
    this.logoutLink = "//a[contains(@class,'logout')]";
  }

  /**
   * Navigates the browser to the specified URL.
   * @param {string} url - The URL to navigate to.
   */
  async goto(url) {
    return this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  /**
   * Logs into the application using the provided credentials.
   * @param {string} username - The user's ID or username.
   * @param {string} password - The user's PIN or password.
   */
  async loginToApp(username, password) {
    console.log(`[Smoke] loginToApp: filling username for ${username}`);
    await this.usernameInput.fill(username);
    await this.nextButton.click();
    try {
      await this.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
    } catch (e) {
      console.log('[Smoke] loginToApp: password input did not appear within timeout');
      throw e;
    }
    console.log('[Smoke] loginToApp: filling password');
    await this.passwordInput.fill(password);
    // Click sign-in and wait for navigation or network idle; tolerate no-navigation cases.
    console.log('[Smoke] loginToApp: clicking sign in');
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
      this.signInButton.click()
    ]);
    console.log('[Smoke] loginToApp: sign in clicked');
  }

  /**
   * Logs out the currently signed-in user.
   */
  async logoutFromApp() {
    await this.page.locator(this.userInfoButton).click();
    await this.page.locator(this.logoutLink).click();
  }
}

module.exports = { LoginPage };
