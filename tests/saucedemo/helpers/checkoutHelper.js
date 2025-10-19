const { expect } = require('@playwright/test'); 

async function fillCheckoutForm(page, { firstName = '', lastName = '', postalCode = '' }) {
  if (firstName) await page.fill('[data-test="firstName"]', firstName);
  if (lastName) await page.fill('[data-test="lastName"]', lastName);
  if (postalCode) await page.fill('[data-test="postalCode"]', postalCode);
}

async function submitCheckoutForm(page) {
  await page.click('[data-test="continue"]');
}

async function verifyCheckoutError(page, expectedError) {
  const errorLocator = page.locator('[data-test="error"]');
  await expect(errorLocator).toBeVisible();
  await expect(errorLocator).toHaveText(expectedError);
}

module.exports = { fillCheckoutForm, submitCheckoutForm, verifyCheckoutError };
