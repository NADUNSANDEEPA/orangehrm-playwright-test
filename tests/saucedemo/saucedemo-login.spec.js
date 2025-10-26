const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { LoginPage } = require('./poms/LoginPage');
const { SAUCEDEMO_LINK } = require('../../config');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];


test.beforeAll(() => {
  console.log("===== Starting SauceDemo Login Tests =====");
});

test.describe('SauceDemo Login Tests using Playwright', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.startTime = performance.now();
    await page.goto(`${SAUCEDEMO_LINK}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const duration = (performance.now() - testInfo.startTime).toFixed(2);
    const status = testInfo.status;
    const testName = testInfo.title;

    testTimes.push({ testName, time: duration, status });

    if (status === 'passed') passCount++;
    else if (status === 'failed') {
      failCount++;
      errors.push({
        test: testName,
        error: testInfo.error ? testInfo.error.message : 'Unknown error',
      });
    }

    console.log(`Test "${testName}" finished in ${duration}ms [${status}]`);

    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('Test Case 01 : Logs in successfully with standard_user', async ({ page }) => {
    await loginSauceDemo(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Test Case 02 : Locked out user shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Test Case 03 : Problem user can log in but may have UI issues', async ({ page }) => {
    await loginSauceDemo(page, 'problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('Test Case 04 : Performance glitch user login', async ({ page }) => {
    await loginSauceDemo(page, 'performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('Test Case 05 : Error user login', async ({ page }) => {
    await loginSauceDemo(page, 'error_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('Test Case 06 : Visual user login', async ({ page }) => {
    await loginSauceDemo(page, 'visual_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('Test Case 07 : Shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  test('Test Case 08 : Shows error when fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test.afterAll(() => {

    const totalTimeMs = testTimes.reduce((sum, t) => sum + parseFloat(t.time), 0);
    const totalTimeSec = (totalTimeMs / 1000).toFixed(2);

    console.log("\n===== TEST SUMMARY =====");
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    const total = passCount + failCount;
    console.log(`Success Rate: ${total ? ((passCount / total) * 100).toFixed(2) : 0}%`);
    console.log(`\nTotal Execution Time: ${totalTimeSec}s`);
    console.log("\nTest Durations:");
    testTimes.forEach(t => console.log(`- ${t.testName}: ${t.time}ms [${t.status}]`));
    if (errors.length > 0) {
      console.log("\nErrors captured during test run:");
      errors.forEach(err => console.log(`- ${err.test}: ${err.error}`));
    }
    console.log('===== Finished all SauceDemo login tests =====');
  });

});
