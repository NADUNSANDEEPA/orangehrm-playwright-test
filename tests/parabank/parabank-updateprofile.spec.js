const { test, expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../config');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { loginParabank } = require('./helpers/bankLoginHelper');

GlobalCredentialsForBank.setUsername("user" + Math.random().toString(16).slice(2));
GlobalCredentialsForBank.setPassword("Password123!");

test.describe('Parabank Update Profile Tests', () => {
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

    test.beforeAll(async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/register.htm`);
        await page.fill('#customer\\.firstName', user.firstName);
        await page.fill('#customer\\.lastName', user.lastName);
        await page.fill('#customer\\.address\\.street', user.address);
        await page.fill('#customer\\.address\\.city', user.city);
        await page.fill('#customer\\.address\\.state', user.state);
        await page.fill('#customer\\.address\\.zipCode', user.zipCode);
        await page.fill('#customer\\.phoneNumber', user.phoneNumber);
        await page.fill('#customer\\.ssn', user.ssn);
        await page.fill('#customer\\.username', user.username);
        await page.fill('#customer\\.password', user.password);
        await page.fill('#repeatedPassword', user.confirmPassword);

        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle" }),
            page.click('input[type="submit"][value="Register"]')
        ]);

        await page.click('#leftPanel a:has-text("Log Out")');
    });

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
            page.waitForNavigation({ waitUntil: "networkidle" }),
            page.click('input[value="Update Profile"]')
        ]);
        await expect(page).toHaveURL(/updateprofile.htm/);
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
            page.waitForResponse(response => response.url().includes('updateprofile.htm') && response.status() === 200),
            page.click('input[value="Update Profile"]')
        ]);

        await expect(page.locator('body')).toContainText('Profile Updated');
    });

    test('Test Case 04 : Open New Account Successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/openaccount.htm`);
        await page.selectOption('#type', '0');
        const options = await page.locator('#fromAccountId option').all();
        if (options.length > 0) {
            await page.selectOption('#fromAccountId', options[0].getAttribute('value'));
        }

        await Promise.all([
            page.waitForResponse(response => response.url().includes('openaccount.htm') && response.status() === 200),
            page.click('input[value="Open New Account"]')
        ]);

        await expect(page.locator('#openAccountResult')).toBeVisible();
        await expect(page.locator('#openAccountResult h1')).toContainText('Account Opened!');
        await expect(page.locator('#openAccountResult p')).toContainText('Congratulations, your account is now open.');

        const newAccountNumber = await page.locator('#newAccountId').textContent();
        expect(newAccountNumber).toMatch(/\d+/);
    });

    test('Test Case 05 : Do Transfer', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/transfer.htm`);
        const transferAmount = "22";
        await page.fill('#amount', transferAmount);
        await new Promise(r => setTimeout(r, 2000));
        await Promise.all([
            page.waitForResponse(response => response.url().includes('transfer.htm') && response.status() === 200),
            page.click('input[type="submit"][value="Transfer"]')
        ]);

        await expect(page.locator('#amountResult')).toContainText(`$${transferAmount}`);
    });

    test('Test Case 06 : Get row count and total balance', async ({ page }) => {
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

    test('Test Case 07: Should apply for a loan successfully', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/requestloan.htm`);
        await page.fill('#amount', '50');
        await page.fill('#downPayment', '10');
        await new Promise(r => setTimeout(r, 2000));
        await Promise.all([
            page.waitForResponse(response => response.url().includes('requestloan.htm') && response.status() === 200),
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
            page.waitForResponse(response => response.url().includes('requestloan.htm') && response.status() === 200),
            page.click('input[value="Apply Now"]')
        ]);
        await expect(page.locator('#loanRequestDenied')).toBeVisible();
        await expect(page.locator('#loanRequestDenied p.error')).toContainText('You do not have sufficient funds for the given down payment.');
        await expect(page.locator('#loanRequestApproved')).toHaveCSS('display', 'none');
    });
});
