class WebNavigatorPage {
    
    constructor(page) {
        this.page = page;
    }

    async navigateToSubMenu(menu, submenu, submenu2) {
        await this.page.waitForTimeout(3000);
        await this.page.locator(`//span[text()='${menu}' and @class='sk--main-menu-title']`).click();
        await this.page.waitForTimeout(3000);
        await this.page.locator(`//li[contains(@class,'submenu-active')]//a[@class='sub-menu-item-container ']/span[text()='${submenu}']`).first().click();
        if(submenu2 !== ""){
             if (submenu2 === "General Information"){
            await this.page.waitForTimeout(3000);
            await this.page.locator(`//div[contains(@class,'submenu-active')]//a[@class='sub-menu-item-container ']/span[text()='${submenu2}']`).click();
            }
            else if (submenu2 !== null) {
                await this.page.waitForTimeout(3000);
                await this.page.locator(`//div[contains(@class,'submenu-active')]//a[@class='sub-menu-item-container ']/span[text()='${submenu2}']`).click();
            }
        }
       
    }

    async navigateToMainMenu(menu) {
        await this.page.waitForTimeout(3000);
        await this.page.locator(`//span[text()='${menu}']`).first().click();
        await this.page.waitForTimeout(3000);
    }
}

module.exports = { WebNavigatorPage };