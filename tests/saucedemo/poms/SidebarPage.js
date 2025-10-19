class SidebarPage {
  constructor(page) {
    this.page = page;
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
  }

  async openMenu() {
    await this.burgerMenuBtn.click();
  }

  async clickAllItems() {
    await this.allItemsLink.click();
  }

  async getAboutLinkHref() {
    return this.aboutLink.getAttribute('href');
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickResetAppState() {
    await this.resetAppStateLink.click();
  }

  async isShoppingCartBadgePresent() {
    return this.shoppingCartBadge.count().then(count => count > 0);
  }
}

module.exports = { SidebarPage };
