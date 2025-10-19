const { test, expect } = require('@playwright/test');
const { loginParabank } = require('./helpers/bankLoginHelper');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { PARA_BANK_LINK } = require('../../config');

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
        await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
        await expect(page).toHaveURL(/\/overview.htm/);
    });
});
