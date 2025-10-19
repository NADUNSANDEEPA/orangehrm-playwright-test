const { expect } = require('@playwright/test');
const { PARA_BANK_LINK } = require('../../../config');

async function loginParabank(page, username, password) {
    if (!username || !password) throw new Error('Username or password is undefined');
    await page.goto(`${PARA_BANK_LINK}/parabank/index.htm`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.click('input[type="submit"][value="Log In"]')
    ]);
}

async function fillRegistrationForm(page, user) {
    const requiredFields = [
        'firstName', 'lastName', 'address', 'city', 'state',
        'zipCode', 'phoneNumber', 'ssn', 'username', 'password', 'confirmPassword'
    ];

    const missing = requiredFields.filter(f => !user[f]);
    if (missing.length > 0) {
        throw new Error(`Missing required user fields: ${missing.join(', ')}`);
    }

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
}

async function checkErrorMessage(page, fieldId, message) {
    const locator = page.locator(`#${fieldId}`);
    await expect(locator).toBeVisible({ timeout: 10000 });
    await expect(locator).toContainText(message);
}

module.exports = { loginParabank, fillRegistrationForm, checkErrorMessage };
