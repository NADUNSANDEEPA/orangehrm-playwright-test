const { expect } = require('@playwright/test');

class MainMenuPage {
  constructor(page) {
    this.page = page;
  }

  async clickMenuItem(menu) {
    const menuLocator = this.page.locator('.oxd-main-menu-item', { hasText: menu });
    await expect(menuLocator).toBeVisible();
    await menuLocator.click();
  }

  async verifyNavigation(menu) {
    if (menu === 'My Info') {
      await expect(this.page).toHaveURL(/viewPersonalDetails/);
    } else {
      const urlPart = menu.toLowerCase().replace(/\s/g, '');
      await expect(this.page).toHaveURL(new RegExp(urlPart));
    }
  }

  async verifyNoErrors() {
    await expect(this.page.locator('body')).not.toContainText('HTTP ERROR 404');
    await expect(this.page.locator('.error-code')).toHaveCount(0);
  }
}

module.exports = { MainMenuPage };
