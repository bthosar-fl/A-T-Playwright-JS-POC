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

    async navigateToSubMenu(menu, submenu, submenu2) {
        await this.page.waitForTimeout(3000);
        await this.page.locator(`//span[text()='${menu}' and @class='sk--main-menu-title']`).click();
        await this.page.waitForTimeout(3000);
        await this.page.locator(`//a[@class='sub-menu-item-container ']/span[text()='${submenu}']`).first().click();
        if (submenu2 === "General Information"){
            await this.page.waitForTimeout(3000);
            await this.page.locator(`//a[@class='sub-menu-item-container ']/span[text()='${submenu2}']`).nth(1).click();
        }
        else if (submenu2 !== null) {
            await this.page.waitForTimeout(3000);
            await this.page.locator(`//a[@class='sub-menu-item-container ']/span[text()='${submenu2}']`).click();
        }
    }
}

module.exports = { HomePage };