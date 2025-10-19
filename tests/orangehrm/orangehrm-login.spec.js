const { test, expect } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { LoginPage } = require('./poms/LoginPage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe('Login Page - OrangeHRM', () => {
  let passCount = 0;
  let failCount = 0;
  const errors = [];
  const url = `${ORANGE_HRM_LINK}/web/index.php/auth/login`;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    const loginPage = new LoginPage(page);
    await loginPage.navigate(url);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'passed') passCount++;
    else if (testInfo.status === 'failed') {
      failCount++;
      errors.push({ test: testInfo.title, error: testInfo.error.message });
    }
  });

  test.afterAll(() => {
    console.log(`Passed tests: ${passCount}`);
    console.log(`Failed tests: ${failCount}`);
    if (errors.length > 0) {
      console.log('Errors captured during test run:');
      for (const err of errors) console.log(err);
    }
  });

  test('Test Case 01 : Renders login form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 5000 });
    const usernamePlaceholder = await loginPage.usernameInput.getAttribute('placeholder');
    expect(['username', '用户名']).toContain(usernamePlaceholder.trim().toLowerCase());

    await expect(loginPage.passwordInput).toBeVisible({ timeout: 5000 });
    const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
    expect(['password', '密码']).toContain(passwordPlaceholder.trim().toLowerCase());

    await expect(loginPage.submitButton).toBeVisible({ timeout: 5000 });
    const buttonText = await loginPage.submitButton.textContent();
    expect(['登录', 'login']).toContain(buttonText.trim().toLowerCase());
  });

  test('Test Case 02 : Logs in with valid credentials and measures execution time', async ({ page }) => {
    const start = Date.now();
    await loginUI(page, 'Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });

    const heading = page.locator('h6.oxd-text--h6');
    await expect(heading).toBeVisible({ timeout: 5000 });
    const headingText = await heading.textContent();
    expect(['Dashboard', '仪表盘']).toContain(headingText.trim());

    console.log('logs in with valid credentials execution time (ms):', Date.now() - start);
  });

  test('Test Case 03 : Shows error with invalid credentials and captures screenshot', async ({ page }) => {
    const start = Date.now();

    // Navigate to login page
    await page.goto(url);

    // Fill invalid credentials
    await page.fill('input[name="username"]', 'wrongUser');
    await page.fill('input[name="password"]', 'wrongPass');

    // Click login button and wait for error to appear
    await Promise.all([
      page.waitForSelector('.oxd-alert-content-text', { state: 'visible', timeout: 10000 }),
      page.click('button[type="submit"]'),
    ]);

    // Create locator for error message
    const alertContent = page.locator('.oxd-alert-content-text');

    // Assert error text
    await expect(alertContent).toBeVisible();
    await expect(alertContent).toContainText('Invalid credentials');

    // Capture screenshot for failure analysis
    await page.screenshot({ path: 'invalid-login.png' });

    console.log('invalid credentials test execution time (ms):', Date.now() - start);
  });


  test('Test Case 04 : Navigates to Forgot Password page', async ({ page }) => {
    const start = Date.now();
    const loginPage = new LoginPage(page);

    await expect(loginPage.forgotPasswordLink.locator('p.orangehrm-login-forgot-header')).toBeVisible({ timeout: 5000 });
    await expect(loginPage.forgotPasswordLink).toContainText('Forgot your password?', { timeout: 5000 });

    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/auth\/requestPasswordResetCode/, { timeout: 10000 });
    const resetHeader = page.locator('h6');
    await expect(resetHeader).toBeVisible({ timeout: 5000 });
    await expect(resetHeader).toContainText('Reset Password');

    console.log('navigates to Forgot Password page execution time (ms):', Date.now() - start);
  });

  test('Test Case 05 : Displays footer copyright correctly', async ({ page }) => {
    const start = Date.now();
    const loginPage = new LoginPage(page);

    await loginPage.footerContainsTexts('© 2005 - 2025', 'OrangeHRM, Inc', 'All rights reserved.');
    await loginPage.footerLinkHasAttributes('http://www.orangehrm.com', '_blank', 'OrangeHRM, Inc');

    console.log('footer copyright execution time (ms):', Date.now() - start);
  });
});
