const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { fillCheckoutForm, submitCheckoutForm, verifyCheckoutError } = require('./helpers/checkoutHelper');
const { CheckoutStepOnePage } = require('./poms/CheckoutStepOnePage');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];

test.beforeAll(() => {
  console.log("===== Starting SauceDemo Checkout Step One Tests =====");
});

test.describe('SauceDemo Checkout Step One Tests', () => {

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.addBackpackToCart();
    await checkoutPage.goToCart();
    await checkoutPage.startCheckout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });

  const runTest = (name, fn) => {
    test(name, async ({ page }) => {
      const start = Date.now();
      try {
        console.log(`Running ${name}...`);
        await fn(page);
        passCount++;
        console.log(`${name} Passed`);
      } catch (error) {
        failCount++;
        errors.push({ test: name, message: error.message });
        console.error(`${name} Failed: ${error.message}`);
      } finally {
        const end = Date.now();
        testTimes.push({ testName: name, time: ((end - start) / 1000).toFixed(2) });
      }
    });
  };

  runTest('Test Case 01 : Shows error if First Name is empty', async (page) => {
    await fillCheckoutForm(page, { lastName: 'Doe', postalCode: '12345' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: First Name is required');
  });

  runTest('Test Case 02 : Shows error if Last Name is empty', async (page) => {
    await fillCheckoutForm(page, { firstName: 'John', postalCode: '12345' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: Last Name is required');
  });

  runTest('Test Case 03 : Shows error if Postal Code is empty', async (page) => {
    await fillCheckoutForm(page, { firstName: 'John', lastName: 'Doe' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: Postal Code is required');
  });

  runTest('Test Case 04 : Proceeds to next step if all fields are filled', async (page) => {
    await fillCheckoutForm(page, { firstName: 'John', lastName: 'Doe', postalCode: '12345' });
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
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

  console.log("===== Finished SauceDemo Checkout Step One Tests =====\n");
});
