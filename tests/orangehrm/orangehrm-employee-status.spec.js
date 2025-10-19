const { test, expect } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { EmployeeStatusPage } = require('./poms/EmployeeStatusPage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe('OrangeHRM Employee Status Form', () => {
    let passCount = 0;
    let failCount = 0;
    const errors = [];
    const empStatus = Math.floor(Math.random() * 10000).toString();
    const url = `${ORANGE_HRM_LINK}/web/index.php/admin/saveEmploymentStatus`;

    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Starting test: ${testInfo.title}`);
        await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
        await loginUI(page, 'Admin', 'admin123');
        await page.goto(url);
        await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 10000 });
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

    test('Test Case 01 : Should save employee status with valid data', async ({ page }) => {
        const statusPage = new EmployeeStatusPage(page);
        await statusPage.fillStatusForm({ name: empStatus });
        await expect(page).toHaveURL(/\/web\/index.php\/admin\/employmentStatus/, { timeout: 15000 });
    });

    test('Test Case 02 : Duplicate employee status should show error', async ({ page }) => {
        const statusPage = new EmployeeStatusPage(page);
        await statusPage.fillStatusForm({ name: empStatus });
        const errorMsg = await statusPage.getErrorMessage();
        expect(errorMsg).toContain('Already exists');
    });

    test('Test Case 03 : Should show validation error when name is empty', async ({ page }) => {
        const statusPage = new EmployeeStatusPage(page);
        await statusPage.fillStatusForm({ name: '' });
        const errorMsg = await statusPage.getErrorMessage();
        expect(errorMsg).toContain('Required');
    });
});
