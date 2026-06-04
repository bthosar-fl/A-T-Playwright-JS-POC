class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'ID or Username required' });
    this.passwordInput = page.getByRole('textbox', { name: 'PIN or Password required' });
    this.signInButton = page.getByRole('button', { name: 'Sign In Loading' });
    this.userInfoButton = "//button[contains(@id,'user-info-title')]";
    this.logoutLink = "//a[contains(@class,'logout')]";
  }

  /**
   * Navigates the browser to the specified URL.
   * @param {string} url - The URL to navigate to.
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Logs into the application using the provided credentials.
   * @param {string} username - The user's ID or username.
   * @param {string} password - The user's PIN or password.
   */
  async loginToApp(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Logs out the currently signed-in user.
   */
  async logout() {
    await this.page.locator(this.userInfoButton).click();
    await this.page.locator(this.logoutLink).click();
  }
}

module.exports = { LoginPage };