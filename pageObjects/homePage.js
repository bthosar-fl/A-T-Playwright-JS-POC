class HomePage {
    
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
    }

    /**
     * Logs into the application with the provided credentials.
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     */
    async loginToApp(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { HomePage };