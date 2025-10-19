class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.backpackAddToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async addBackpackToCart() {
    await this.backpackAddToCart.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CheckoutStepOnePage };
