const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { addProductsToCart } = require('./helpers/cartHelper');
const { InventoryPage } = require('./poms/InventoryPage');
const { CheckoutPage } = require('./poms/CheckoutPage');

test.describe('SauceDemo Full Checkout Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
  });

  test('Test Case 01: Complete checkout with valid info', async ({ page }) => {
    await addProductsToCart(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    
    const inventory = new InventoryPage(page);
    await inventory.goToCart();
    await expect(page).toHaveURL(/\/cart\.html/);

    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);

    const checkout = new CheckoutPage(page);
    await checkout.fillCheckoutInfo('John', 'Doe', '12345');
    await checkout.continueCheckout();
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);

    await expect(checkout.cartList).toContainText('Sauce Labs Backpack');
    await expect(checkout.cartList).toContainText('Sauce Labs Bike Light');

    await checkout.finishCheckout();
    await expect(page).toHaveURL(/\/checkout-complete\.html/);

    await expect(checkout.completeHeader).toContainText('Thank you for your order!');
  });

});
