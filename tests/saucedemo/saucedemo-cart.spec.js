const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { addProductsToCart } = require('./helpers/cartHelper');
const { CartPage } = require('./poms/CartPage');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];

test.beforeAll(() => {
  console.log("===== Starting SauceDemo Cart Tests =====");
});

test.describe('SauceDemo Cart Tests (Using Commands)', () => {

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log("Cleared cookies and storage after test");
  });

  const runTest = (name, testFn) => {
    test(name, async ({ page }) => {
      const start = Date.now();
      try {
        console.log(`Running ${name}...`);
        await testFn(page);
        passCount++;
        console.log(`${name} Passed`);
      } catch (error) {
        failCount++;
        errors.push({ test: name, message: error.message });
        console.error(`${name} Failed:`, error.message);
      } finally {
        const end = Date.now();
        testTimes.push({ testName: name, time: ((end - start) / 1000).toFixed(2) });
      }
    });
  };

  runTest('Test Case 01 : Should add and verify products in cart', async (page) => {
    await addProductsToCart(page, ['sauce-labs-backpack', 'sauce-labs-bike-light'], 5000);

    const cartPage = new CartPage(page);
    await cartPage.openCart();

    const items = await cartPage.getCartItems();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');
  });

  runTest('Test Case 02 : Should remove a product and verify', async (page) => {
    await addProductsToCart(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);

    const cartPage = new CartPage(page);
    await cartPage.openCart();
    await cartPage.removeProduct('sauce-labs-bike-light');

    const items = await cartPage.getCartItems();
    expect(items).not.toContain('Sauce Labs Bike Light');
    expect(items).toContain('Sauce Labs Backpack');
  });

  runTest('Test Case 03 : Should logout successfully', async (page) => {
    const cartPage = new CartPage(page);
    await cartPage.logout();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.afterAll(async () => {
  const totalTimeSec = testTimes.reduce((sum, t) => sum + parseFloat(t.time), 0).toFixed(2);

  console.log("\n===== TEST SUMMARY =====");
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`\nTotal Execution Time: ${totalTimeSec}s`);

  if (errors.length > 0) {
    console.log("\nError Details:");
    errors.forEach(err => console.log(`- ${err.test}: ${err.message}`));
  }

  console.log("\nIndividual Test Durations:");
  testTimes.forEach(t => console.log(`- ${t.testName}: ${t.time}s`));

  console.log("===== Finished SauceDemo Cart Tests =====\n");
});
