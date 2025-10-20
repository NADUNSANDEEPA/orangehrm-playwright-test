const { test, expect } = require('@playwright/test');
const { LicensePage } = require('./poms/LicensePage');
const { ORANGE_HRM_LINK } = require('../../config');
const { loginUI } = require('./helpers/loginHelper');

test.describe('License Form Tests', () => {
  const licenseUrl = `${ORANGE_HRM_LINK}/web/index.php/admin/saveLicenses`;
  let passCount = 0;
  let failCount = 0;
  const errors = [];

  test.beforeAll(() => {
    console.log('Starting OrangeHRM License Form Test Suite');
  });

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
    await loginUI(page, 'Admin', 'admin123');
    await page.goto(licenseUrl, { waitUntil: 'networkidle' });
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status === 'passed') passCount++;
    else if (testInfo.status === 'failed') {
      failCount++;
      errors.push({ test: testInfo.title, error: testInfo.error.message });
    }
  });

  test.afterAll(() => {
    console.log(`Total Passed: ${passCount}`);
    console.log(`Total Failed: ${failCount}`);
    if (errors.length > 0) {
      console.log('Errors details:');
      errors.forEach(e => console.log(`${e.test}: ${e.error}`));
    }
  });

  test('Test Case 01: Should show error if Name is empty', async ({ page }) => {
    const licensePage = new LicensePage(page);
    await licensePage.clickSave();

    const error = await licensePage.getErrorMessage();
    expect(error).toContain('Required'); 
  });

  test('Test Case 02: Should successfully save license', async ({ page }) => {
    const licensePage = new LicensePage(page);
    await licensePage.fillName('Test License');
    await licensePage.clickSave();

    const toastText = await licensePage.waitForToast();
    expect(toastText).toContain('Success'); 
  });
});
