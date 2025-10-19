const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { LoginPage } = require('./poms/LoginPage');
const { SAUCEDEMO_LINK } = require('../../config');

test.describe('SauceDemo Login Tests using Playwright', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${SAUCEDEMO_LINK}`);
  });

  test.afterEach(async ({ page }) => {
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
    console.log('🏁 Finished all SauceDemo login tests');
  });

});
