const { test, expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../config');
const { fillRegistrationForm, checkErrorMessage } = require('./helpers/bankLoginHelper');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');

GlobalCredentialsForBank.setUsername("user" + Math.random().toString(16).slice(2));
GlobalCredentialsForBank.setPassword("Password123!");

test.describe('Parabank Registration Tests Using Commands', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/register.htm`);
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
