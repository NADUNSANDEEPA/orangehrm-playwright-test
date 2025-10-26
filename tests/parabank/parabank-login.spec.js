const { test, expect } = require('@playwright/test');
const { loginParabank } = require('./helpers/bankLoginHelper');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { PARA_BANK_LINK } = require('../../config');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];
let testStartTime;

test.describe('Parabank Login Tests Using Commands', () => {

    test.beforeAll(async () => {
        console.log("===== Starting Parabank Login Test Suite =====");
    });


    test.beforeEach(async () => {
        testStartTime = performance.now();
    });

    test.afterEach(async ({ }, testInfo) => {
        const duration = (performance.now() - testStartTime).toFixed(2);
        const status = testInfo.status;
        const testName = testInfo.title;

        testTimes.push({ testName, time: duration, status });

        if (status === 'passed') passCount++;
        if (status === 'failed') {
            failCount++;
            errors.push({ test: testName, error: testInfo.error?.message || 'Unknown error' });
        }

        console.log(`Test "${testName}" finished in ${duration}ms [${status}]`);
    });

    test.afterAll(() => {
        console.log('===== TEST SUMMARY =====');
        console.log(`Passed: ${passCount}`);
        console.log(`Failed: ${failCount}`);
        const totalTests = passCount + failCount;
        const successRate = totalTests > 0 ? ((passCount / totalTests) * 100).toFixed(2) : 0;
        console.log(`Success Rate: ${successRate}%`);
        const totalTime = testTimes.reduce((sum, t) => sum + parseFloat(t.time), 0);
        console.log(`Total runtime: ${totalTime.toFixed(2)}ms`);
        console.log('Detailed Timings:');
        testTimes.forEach((t) => console.log(`- ${t.testName}: ${t.time}ms [${t.status}]`));
        if (errors.length > 0) {
            console.log('Errors captured during test run:');
            errors.forEach((err) => console.log(`- ${err.test}: ${err.error}`));
        }
        console.log("===== Finished Parabank Login Tests Using Commands =====");
    });

    test('Test Case 01 : Should show error when submitting empty form', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/index.htm`);
        await page.click('input[type="submit"][value="Log In"]');
        const error = page.locator('.error');
        await expect(error).toBeVisible();
        await expect(error).toContainText('Please enter a username and password.');
    });

    test('Test Case 02 : Should show error for invalid credentials', async ({ page }) => {
        await loginParabank(page, 'nadunee', 'wrongPassword' + Date());
        const error = page.locator('.error');
        await expect(error).toBeVisible();
        await expect(error).toContainText('The username and password could not be verified.');
    });

    test('Test Case 03 : Should login successfully with valid credentials', async ({ page }) => {
        await loginParabank(
            page,
            GlobalCredentialsForBank.getUsername(),
            GlobalCredentialsForBank.getPassword()
        );
        await expect(page).toHaveURL(/\/overview.htm/);
    });
});
