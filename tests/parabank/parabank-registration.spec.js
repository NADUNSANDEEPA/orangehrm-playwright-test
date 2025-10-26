const { test, expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../config');
const { fillRegistrationForm, checkErrorMessage } = require('./helpers/bankLoginHelper');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];

test.describe('Parabank Registration Tests Using Commands', () => {

    test.beforeAll(async () => {
        console.log('===== Starting Parabank Registration Test Suite =====');
    });

    test.beforeEach(async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/register.htm`);
        test.info().startTime = performance.now();
    });

    test.afterEach(async ({}, testInfo) => {
        const duration = (performance.now() - testInfo.startTime).toFixed(2);
        const status = testInfo.status;
        const testName = testInfo.title;

        testTimes.push({ testName, time: duration, status });

        if (status === 'passed') passCount++;
        if (status === 'failed') {
            failCount++;
            errors.push({
                test: testName,
                error: testInfo.error ? testInfo.error.message : 'Unknown error',
            });
        }

        console.log(`Test "${testName}" finished in ${duration}ms [${status}]`);
    });

    test.afterAll(async () => {
        console.log("===== TEST SUMMARY =====");
        console.log(`Passed: ${passCount}`);
        console.log(`Failed: ${failCount}`);

        const totalTests = passCount + failCount;
        const successRate = totalTests > 0 ? ((passCount / totalTests) * 100).toFixed(2) : 0;
        console.log(`Success Rate: ${successRate}%`);

        console.log("Detailed Timings:");
        testTimes.forEach((t) => {
            console.log(`- ${t.testName}: ${t.time}ms [${t.status}]`);
        });

        if (errors.length > 0) {
            console.log("Errors captured during test run:");
            errors.forEach((err) => console.log(`- ${err.test}: ${err.error}`));
        }
        console.log("===== Finished Parabank Registration Tests Using Commands =====");
    });

    test('Test Case 01 : Should show errors when submitting empty form', async ({ page }) => {
        await page.click('input[type="submit"][value="Register"]');
        await checkErrorMessage(page, 'customer\\.firstName\\.errors', 'First name is required.');
        await checkErrorMessage(page, 'customer\\.lastName\\.errors', 'Last name is required.');
        await checkErrorMessage(page, 'customer\\.address\\.street\\.errors', 'Address is required.');
        await checkErrorMessage(page, 'customer\\.address\\.city\\.errors', 'City is required.');
        await checkErrorMessage(page, 'customer\\.address\\.state\\.errors', 'State is required.');
        await checkErrorMessage(page, 'customer\\.address\\.zipCode\\.errors', 'Zip Code is required.');
        await checkErrorMessage(page, 'customer\\.ssn\\.errors', 'Social Security Number is required.');
        await checkErrorMessage(page, 'customer\\.username\\.errors', 'Username is required.');
        await checkErrorMessage(page, 'customer\\.password\\.errors', 'Password is required.');
        await checkErrorMessage(page, 'repeatedPassword\\.errors', 'Password confirmation is required.');
    });

    test('Test Case 02 : Should register successfully with valid data', async ({ page }) => {
        const user = {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phoneNumber: '1234567890',
            ssn: '123-45-6789',
            username: GlobalCredentialsForBank.getUsername(),
            password: GlobalCredentialsForBank.getPassword(),
            confirmPassword: GlobalCredentialsForBank.getPassword()
        };

        await fillRegistrationForm(page, user);
        await Promise.all([
            page.waitForNavigation(),
            page.click('input[type="submit"][value="Register"]')
        ]);
        await expect(page.locator('text=Your account was created successfully')).toBeVisible();
    });

    test('Test Case 03 : Should show error if username already exists', async ({ page }) => {
        const existingUser = {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62704',
            phoneNumber: '5551234567',
            ssn: '123-45-6789',
            username: GlobalCredentialsForBank.getUsername(),
            password: GlobalCredentialsForBank.getPassword(),
            confirmPassword: GlobalCredentialsForBank.getPassword()
        };

        await fillRegistrationForm(page, existingUser);
        await Promise.all([
            page.waitForResponse(response => response.url().includes('register.htm') && response.status() === 200),
            page.click('input[type="submit"][value="Register"]'),
        ]);
        const error = page.locator('.error');
        await expect(error).toContainText('This username already exists');
    });

});
