const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { addProductsToCart } = require('./helpers/cartHelper');
const { CartPage } = require('./poms/CartPage');

test.describe('SauceDemo Cart Tests (Using Commands)', () => {

  test.beforeAll(() => {
    console.log('Starting SauceDemo Cart Tests');
  });

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('Test Case 01 : Should add and verify products in cart', async ({ page }) => {
    await addProductsToCart(page, ['sauce-labs-backpack', 'sauce-labs-bike-light'], 5000);

    const cartPage = new CartPage(page);
    await cartPage.openCart();

    const items = await cartPage.getCartItems();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');
  });

  test('Test Case 02 : Should remove a product and verify', async ({ page }) => {
    await addProductsToCart(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);

    const cartPage = new CartPage(page);
    await cartPage.openCart();
    await cartPage.removeProduct('sauce-labs-bike-light');

    const items = await cartPage.getCartItems();
    expect(items).not.toContain('Sauce Labs Bike Light');
    expect(items).toContain('Sauce Labs Backpack');
  });

  test('Test Case 03 : Should logout successfully', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.logout();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
