class CartPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.locator('.shopping_cart_link');
    this.removeButton = id => page.locator(`#remove-${id}`);
    this.cartItems = page.locator('.cart_item .inventory_item_name');
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async openCart() {
    await this.cartLink.click();
  }

  async removeProduct(id) {
    await this.removeButton(id).click();
  }

  async getCartItems() {
    return await this.cartItems.allTextContents();
  }

  async logout() {
    await this.burgerMenuBtn.click();
    await this.logoutLink.click();
  }
}

module.exports = { CartPage };
