const { test } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { UserAddPage } = require('./poms/UserAddPage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe('OrangeHRM User Add Page', () => {
  let passCount = 0;
  let failCount = 0;
  const errors = [];
  const username = 'User' + Math.floor(Math.random() * 1000);
  const validUserName = true;
  const url = `${ORANGE_HRM_LINK}/web/index.php/admin/saveSystemUser`;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
    await loginUI(page, 'Admin', 'admin123');
    await page.goto(url);
  });

  test.afterEach(async ({ page }, testInfo) => {
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

  test('Test Case 01 : User Save Success', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: 'Admin',
      employeeName: validUserName,
      status: 'Enabled',
      username: username,
      password: 'StrongPass!123',
      confirmPassword: 'StrongPass!123'
    });
    
    await expect(page).toHaveURL(/\/web\/index.php\/admin\/viewSystemUsers/, { timeout: 15000 });
  });

  test('Test Case 02 : User Name Validation - Should be at least 5 characters', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: 'Admin',
      employeeName: validUserName,
      status: 'Enabled',
      username: 'i',
      password: 'StrongPass!123',
      confirmPassword: 'StrongPass!123'
    });
    await userAddPage.errorMessagesContain('Should be at least 5 characters');
  });

  test('Test Case 03 : User Name Validation - Already exists', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: 'Admin',
      employeeName: validUserName,
      status: 'Enabled',
      username: username,
      password: 'StrongPass!123',
      confirmPassword: 'StrongPass!123'
    });
    await userAddPage.errorMessagesContain('Already exists');
  });

  test('Test Case 04 : Password Validation', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: 'Admin',
      employeeName: validUserName,
      status: 'Enabled',
      username: 'A8DCo 4Ys 010Z',
      password: '12',
      confirmPassword: '2'
    });
    await userAddPage.errorMessagesContain('Should have at least 7 characters');
    await userAddPage.errorMessagesContain('Passwords do not match');
  });

  test('Test Case 05 : Employee Name Validation - Invalid', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: 'Admin',
      employeeName: false,
      status: 'Enabled',
      username: 'username' + Math.floor(Math.random() * 1000),
      password: 'StrongPass!123',
      confirmPassword: 'StrongPass!123'
    });
    await userAddPage.errorMessagesContain('Invalid');
  });

  test('Test Case 06 : shows required field errors when submitted empty', async ({ page }) => {
    const userAddPage = new UserAddPage(page);
    await userAddPage.fillForm({
      userRole: '',
      employeeName: '',
      status: '',
      username: '',
      password: '',
      confirmPassword: ''
    });

    await expect(page.locator('.oxd-select-text--error').nth(0)).toContainText('-- Select --');
    await expect(page.locator('.oxd-autocomplete-text-input--error')).toBeVisible();
    await expect(page.locator('.oxd-select-text--error').nth(1)).toContainText('-- Select --');
    await expect(page.locator('input.oxd-input--error[autocomplete="off"]')).toHaveCountGreaterThan(0);
    await expect(page.locator('input[type="password"].oxd-input--error')).toHaveCount(2);

    const errorMessages = page.locator('.oxd-input-field-error-message');
    await expect(errorMessages.nth(0)).toContainText('Required');
    await expect(errorMessages.nth(1)).toContainText('Required');
    await expect(errorMessages.nth(2)).toContainText('Required');
    await expect(errorMessages.nth(3)).toContainText('Required');
    await expect(errorMessages.nth(4)).toContainText('Required');
    await expect(errorMessages.nth(5)).toContainText('Passwords do not match');
  });
});
