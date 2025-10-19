const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { fillCheckoutForm, submitCheckoutForm, verifyCheckoutError } = require('./helpers/checkoutHelper');
const { CheckoutStepOnePage } = require('./poms/CheckoutStepOnePage');

test.describe('SauceDemo Checkout Step One Tests', () => {

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);

    const checkoutPage = new CheckoutStepOnePage(page);
    await checkoutPage.addBackpackToCart();
    await checkoutPage.goToCart();
    await checkoutPage.startCheckout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });

  test('Test Case 01 : Shows error if First Name is empty', async ({ page }) => {
    await fillCheckoutForm(page, { lastName: 'Doe', postalCode: '12345' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: First Name is required');
  });

  test('Test Case 02 : Shows error if Last Name is empty', async ({ page }) => {
    await fillCheckoutForm(page, { firstName: 'John', postalCode: '12345' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: Last Name is required');
  });

  test('Test Case 03 : Shows error if Postal Code is empty', async ({ page }) => {
    await fillCheckoutForm(page, { firstName: 'John', lastName: 'Doe' });
    await submitCheckoutForm(page);
    await verifyCheckoutError(page, 'Error: Postal Code is required');
  });

  test('Test Case 04 : Proceeds to next step if all fields are filled', async ({ page }) => {
    await fillCheckoutForm(page, { firstName: 'John', lastName: 'Doe', postalCode: '12345' });
    await submitCheckoutForm(page);
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  });

});
