const { test, expect } = require('@playwright/test');
const { loginParabank, fillRegistrationForm } = require('./helpers/bankLoginHelper');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { PARA_BANK_LINK } = require('../../config');

GlobalCredentialsForBank.setUsername('user' + Math.random().toString(16).slice(2));
GlobalCredentialsForBank.setPassword('Password123!');

test.describe('Parabank Login Tests Using Commands', () => {
    test('Test Case 01 : Should show error when submitting empty form', async ({ page }) => {
        await page.goto(`${PARA_BANK_LINK}/parabank/index.htm`);
        await page.click('input[type="submit"][value="Log In"]');
        const error = page.locator('.error');
        await expect(error).toBeVisible();
        await expect(error).toContainText('Please enter a username and password.');
    });

    test('Test Case 02 : Should show error for invalid credentials', async ({ page }) => {
        await loginParabank(page, 'nadunee', 'wrongPassword');
        const error = page.locator('.error');
        await expect(error).toBeVisible();
        await expect(error).toContainText('The username and password could not be verified.');
    });

    test('Test Case 03 : Should login successfully with valid credentials', async ({ page }) => {
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

        await page.goto(`${PARA_BANK_LINK}/parabank/register.htm`);
        await fillRegistrationForm(page, user);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.click('input[type="submit"][value="Register"]')
        ]);

        const logoutLink = page.locator('#leftPanel a', { hasText: 'Log Out' });
        await expect(logoutLink).toBeVisible();
        await logoutLink.click();

        await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
        await expect(page).toHaveURL(/\/overview.htm/);
    });
});
