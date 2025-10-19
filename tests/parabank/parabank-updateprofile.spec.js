const { test, expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../config');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { loginParabank } = require('./helpers/bankLoginHelper');

test.describe('Parabank Update Profile Tests', () => {

    test.beforeEach(async ({ page }) => {
        await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
        await expect(page).toHaveURL(/overview.htm/);
    });

    test('Test Case 01 : Should display all input fields', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);
        await expect(page.locator('#customer\\.firstName')).toBeVisible();
        await expect(page.locator('#customer\\.lastName')).toBeVisible();
        await expect(page.locator('#customer\\.address\\.street')).toBeVisible();
        await expect(page.locator('#customer\\.address\\.city')).toBeVisible();
        await expect(page.locator('#customer\\.address\\.state')).toBeVisible();
        await expect(page.locator('#customer\\.address\\.zipCode')).toBeVisible();
        await expect(page.locator('#customer\\.phoneNumber')).toBeVisible();
        await expect(page.locator('input[value="Update Profile"]')).toBeVisible();
    });

    test('Test Case 02 : Should allow clicking Update with empty fields (no crash)', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);

        await page.fill('#customer\\.firstName', '');
        await page.fill('#customer\\.lastName', '');
        await page.fill('#customer\\.address\\.street', '');
        await page.fill('#customer\\.address\\.city', '');
        await page.fill('#customer\\.address\\.state', '');
        await page.fill('#customer\\.address\\.zipCode', '');
        await page.fill('#customer\\.phoneNumber', '');

        await Promise.all([
            page.click('input[value="Update Profile"][type="button"]')
        ]);

        await expect(page).toHaveURL(/updateprofile\.htm/);

        await expect(page.locator('span#error')).toHaveCount(0);

        await expect(page.locator('#firstName-error')).toBeVisible();
        await expect(page.locator('#firstName-error')).toHaveText('First name is required.');

        await expect(page.locator('#lastName-error')).toBeVisible();
        await expect(page.locator('#lastName-error')).toHaveText('Last name is required.');

        await expect(page.locator('#street-error')).toBeVisible();
        await expect(page.locator('#street-error')).toHaveText('Address is required.');

        await expect(page.locator('#city-error')).toBeVisible();
        await expect(page.locator('#city-error')).toHaveText('City is required.');

        await expect(page.locator('#state-error')).toBeVisible();
        await expect(page.locator('#state-error')).toHaveText('State is required.');

        await expect(page.locator('#zipCode-error')).toBeVisible();
        await expect(page.locator('#zipCode-error')).toHaveText('Zip Code is required.');

        const phoneError = page.locator('span#error').filter({ hasText: 'Phone number' });
        if (await phoneError.count() > 0) {
            await expect(phoneError).toBeVisible();
        }
    });



    test('Test Case 03 : Should update profile successfully with valid data', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/updateprofile.htm`);
        await page.fill('#customer\\.firstName', 'Jane');
        await page.fill('#customer\\.lastName', 'Smith');
        await page.fill('#customer\\.address\\.street', '456 Green Road');
        await page.fill('#customer\\.address\\.city', 'Kandy');
        await page.fill('#customer\\.address\\.state', 'Central');
        await page.fill('#customer\\.address\\.zipCode', '20000');
        await page.fill('#customer\\.phoneNumber', '0771234567');

        await Promise.all([
            page.click('input[value="Update Profile"]')
        ]);

        await expect(page.locator('body')).toContainText('Profile Updated');
    });

    test('Test Case 04 : Get row count and total balance', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/overview.htm`);
        await new Promise(r => setTimeout(r, 2000));
        const rows = await page.locator('#accountTable tbody tr').all();

        let totalBalance = 0;
        for (let i = 0; i < rows.length - 1; i++) {
            const balanceText = await rows[i].locator('td').nth(1).textContent();
            totalBalance += parseFloat(balanceText.replace('$', ''));
        }

        const totalText = await rows[rows.length - 1].locator('td').nth(1).textContent();
        const totalFromPage = parseFloat(totalText.replace('$', ''));

        expect(totalBalance).toBeCloseTo(totalFromPage, 2);
    });

    test('Test Case 05 : Open New Account Successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/openaccount.htm`);

        await page.selectOption('#type', '0');

        const fromAccountDropdown = page.locator('#fromAccountId option');
        const firstValue = await fromAccountDropdown.first().getAttribute('value');
        await page.selectOption('#fromAccountId', firstValue);

        await page.waitForTimeout(1000);

        await Promise.all([
            page.click('input[value="Open New Account"]'),
        ]);

        const resultLocator = page.locator('#openAccountResult');
        await resultLocator.waitFor({ state: 'visible', timeout: 10000 });

        await expect(resultLocator).toBeVisible();
        await expect(resultLocator.locator('h1')).toContainText('Account Opened!');

        await expect(resultLocator.locator('p').first()).toContainText('Congratulations, your account is now open.');

        const newAccountNumber = await resultLocator.locator('#newAccountId').textContent();
        expect(newAccountNumber).toMatch(/\d+/);
    });


    test('Test Case 06 : Do Transfer', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/transfer.htm`);
        const transferAmount = "22";
        await page.fill('#amount', transferAmount);
        await new Promise(r => setTimeout(r, 2000));
        await Promise.all([
            page.click('input[type="submit"][value="Transfer"]')
        ]);

        await expect(page.locator('#amountResult')).toContainText(`$${transferAmount}`);
    });

    test('Test Case 07: Should apply for a loan successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/requestloan.htm`);
        await page.fill('#amount', '50');
        await page.fill('#downPayment', '10');
        await new Promise(r => setTimeout(r, 2000));
        await Promise.all([
            page.click('input[value="Apply Now"]')
        ]);
        await expect(page.locator('#loanRequestApproved')).toBeVisible();
        await expect(page.locator('#loanRequestApproved p').first()).toContainText('Congratulations, your loan has been approved.');

        const accountNumber = await page.locator('#newAccountId').textContent();
        expect(accountNumber).toMatch(/\d+/);
    });

    test('Test Case 08: Should show error if insufficient funds for down payment', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/requestloan.htm`);
        await page.fill('#amount', '5000');
        await page.fill('#downPayment', '100000');
        await new Promise(r => setTimeout(r, 2000));
        await Promise.all([
            page.click('input[value="Apply Now"]')
        ]);
        await expect(page.locator('#loanRequestDenied')).toBeVisible();
        await expect(page.locator('#loanRequestDenied p.error')).toContainText('You do not have sufficient funds for the given down payment.');
        await expect(page.locator('#loanRequestApproved')).toHaveCSS('display', 'none');
    });
});
