class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
