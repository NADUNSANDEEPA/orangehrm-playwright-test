const { expect } = require('@playwright/test');

class PersonalDetailsPage {
  constructor(page) {
    this.page = page;
    this.tabs = page.locator('.orangehrm-tabs-item');
    this.tabsContainer = page.locator('.orangehrm-tabs');
  }

  async waitForTabs() {
    await expect(this.tabsContainer).toBeVisible({ timeout: 5000 });
  }

  async clickTab(tabName) {
    const tab = this.page.locator('.orangehrm-tabs-item', { hasText: tabName });
    await expect(tab).toBeVisible({ timeout: 5000 });
    await tab.click();
  }

  async verifyUrlMatchesTab(tabName) {
    // Build regex by replacing empNumber digit with \d+
    const tab = await this.page.locator('.orangehrm-tabs-item', { hasText: tabName }).first();
    const href = await tab.getAttribute('href');
    const regexHref = href.replace(/empNumber\/\d+/, 'empNumber/\\d+');
    const urlRegex = new RegExp(regexHref + '$');
    await expect(this.page).toHaveURL(urlRegex, { timeout: 5000 });
  }
}

module.exports = { PersonalDetailsPage };
