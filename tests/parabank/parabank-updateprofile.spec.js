const { test, expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../config');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { loginParabank } = require('./helpers/bankLoginHelper');

let passCount = 0;
let failCount = 0;
const testTimes = [];
const errors = [];

test.describe('Parabank Update Profile & Transactions', () => {

    test.beforeEach(async ({ page }, testInfo) => {
        await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
        await expect(page).toHaveURL(/overview.htm/);
        testInfo.startTime = performance.now();
    });

    test.afterEach(async ({ }, testInfo) => {
        const duration = (performance.now() - testInfo.startTime).toFixed(2);
        const status = testInfo.status;
        const testName = testInfo.title;

        testTimes.push({ testName, time: duration, status });

        if (status === 'passed') passCount++;
        if (status === 'failed') {
            failCount++;
            if (testInfo.error) {
                errors.push({ test: testName, error: testInfo.error.message });
            }
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
        console.log("===== Finished Parabank Update Profile & Transactions =====");
    });

    test('Test Case 01 : Should display all input fields', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);
        const fields = [
            '#customer\\.firstName',
            '#customer\\.lastName',
            '#customer\\.address\\.street',
            '#customer\\.address\\.city',
            '#customer\\.address\\.state',
            '#customer\\.address\\.zipCode',
            '#customer\\.phoneNumber',
            'input[value="Update Profile"]'
        ];
        for (const selector of fields) {
            await expect(page.locator(selector)).toBeVisible();
        }
    });

    test('Test Case 02 : Should show validation errors when submitting empty fields', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);

        const fieldSelectors = [
            '#customer\\.firstName',
            '#customer\\.lastName',
            '#customer\\.address\\.street',
            '#customer\\.address\\.city',
            '#customer\\.address\\.state',
            '#customer\\.address\\.zipCode',
            '#customer\\.phoneNumber'
        ];
        for (const selector of fieldSelectors) {
            await page.fill(selector, '');
        }

        await page.click('input[value="Update Profile"][type="button"]');
        await expect(page).toHaveURL(/updateprofile\.htm/);

        const errorMap = {
            '#firstName-error': 'First name is required.',
            '#lastName-error': 'Last name is required.',
            '#street-error': 'Address is required.',
            '#city-error': 'City is required.',
            '#state-error': 'State is required.',
            '#zipCode-error': 'Zip Code is required.'
        };

        for (const [selector, text] of Object.entries(errorMap)) {
            await expect(page.locator(selector)).toBeVisible();
            await expect(page.locator(selector)).toHaveText(text);
        }
    });

    test('Test Case 03 : Should update profile successfully with valid data', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);
        const userData = {
            '#customer\\.firstName': 'Jane',
            '#customer\\.lastName': 'Smith',
            '#customer\\.address\\.street': '456 Green Road',
            '#customer\\.address\\.city': 'Kandy',
            '#customer\\.address\\.state': 'Central',
            '#customer\\.address\\.zipCode': '20000',
            '#customer\\.phoneNumber': '0771234567'
        };
        for (const [selector, value] of Object.entries(userData)) {
            await page.fill(selector, value);
        }
        await page.click('input[value="Update Profile"]');
        await expect(page.locator('body')).toContainText('Profile Updated');
    });

    test('Test Case 04 : Get row count and verify total balance', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/overview.htm`);
        await page.waitForTimeout(2000);

        const rows = await page.locator('#accountTable tbody tr').all();
        let totalBalance = 0;
        for (let i = 0; i < rows.length - 1; i++) {
            const text = await rows[i].locator('td').nth(1).textContent();
            totalBalance += parseFloat(text.replace('$', ''));
        }

        const totalText = await rows[rows.length - 1].locator('td').nth(1).textContent();
        const totalFromPage = parseFloat(totalText.replace('$', ''));
        expect(totalBalance).toBeCloseTo(totalFromPage, 2);
    });

    test('Test Case 05 : Open New Account Successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/openaccount.htm`);
        await page.selectOption('#type', '0');
        const firstValue = await page.locator('#fromAccountId option').first().getAttribute('value');
        await page.selectOption('#fromAccountId', firstValue);
        await page.waitForTimeout(1000);

        await page.click('input[value="Open New Account"]');
        const resultLocator = page.locator('#openAccountResult');
        await resultLocator.waitFor({ state: 'visible', timeout: 10000 });
        await expect(resultLocator.locator('h1')).toContainText('Account Opened!');
        const newAccountNumber = await resultLocator.locator('#newAccountId').textContent();
        expect(newAccountNumber).toMatch(/\d+/);
    });

    test('Test Case 06 : Do Transfer Successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/transfer.htm`);
        const transferAmount = '22';
        await page.fill('#amount', transferAmount);
        await page.waitForTimeout(2000);

        await page.click('input[type="submit"][value="Transfer"]');
        await expect(page.locator('#amountResult')).toContainText(`$${transferAmount}`);
    });

    test('Test Case 07 : Apply for Loan Successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/requestloan.htm`);
        await page.fill('#amount', '50');
        await page.fill('#downPayment', '10');
        await page.waitForTimeout(2000);

        await page.click('input[value="Apply Now"]');
        const resultLocator = page.locator('#loanRequestApproved');
        await expect(resultLocator).toBeVisible();
        await expect(resultLocator.locator('p').first()).toContainText('Congratulations, your loan has been approved.');

        const accountNumber = await resultLocator.locator('#newAccountId').textContent();
        expect(accountNumber).toMatch(/\d+/);
    });

    test('Test Case 08 : Should show error for insufficient funds', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/requestloan.htm`);
        await page.fill('#amount', '5000');
        await page.fill('#downPayment', '100000');
        await page.waitForTimeout(2000);

        await page.click('input[value="Apply Now"]');
        const deniedLocator = page.locator('#loanRequestDenied');
        await expect(deniedLocator).toBeVisible();
        await expect(deniedLocator.locator('p.error')).toContainText('You do not have sufficient funds for the given down payment.');
        await expect(page.locator('#loanRequestApproved')).toHaveCSS('display', 'none');
    });
});
