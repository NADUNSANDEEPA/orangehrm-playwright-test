const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { addProductsToCart } = require('./helpers/cartHelper');
const { InventoryPage } = require('./poms/InventoryPage');
const { CheckoutPage } = require('./poms/CheckoutPage');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];

test.beforeAll(() => {
  console.log("===== Starting SauceDemo Full Checkout Journey Tests =====");
});

test.describe('SauceDemo Full Checkout Journey', () => {

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
  });

  test('Test Case 01: Complete checkout with valid info', async ({ page }) => {
    const start = Date.now();
    try {
      console.log("Running Test Case 01...");

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

      passCount++;
      console.log("Test Case 01 Passed");
    } catch (error) {
      failCount++;
      errors.push({ test: 'Test Case 01', message: error.message });
      console.error("Test Case 01 Failed:", error.message);
    } finally {
      const end = Date.now();
      testTimes.push({ testName: 'Test Case 01', time: ((end - start) / 1000).toFixed(2) });
    }
  });

});

test.afterAll(async () => {
  const totalTimeSec = testTimes.reduce((sum, t) => sum + parseFloat(t.time), 0).toFixed(2);

  console.log("\n===== TEST SUMMARY =====");
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total Execution Time: ${totalTimeSec}s`);

  if (errors.length > 0) {
    console.log("\nError Details:");
    errors.forEach(err => console.log(`- ${err.test}: ${err.message}`));
  }

  console.log("\nIndividual Test Durations:");
  testTimes.forEach(t => console.log(`- ${t.testName}: ${t.time}s`));

  console.log("===== Finished SauceDemo Full Checkout Journey Tests =====\n");
});
