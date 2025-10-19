const { test, expect } = require('@playwright/test');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
const { PARA_BANK_LINK } = require('../../config');
const { loginParabank } = require('./helpers/bankLoginHelper');

const links = [
  { text: 'Open New Account', href: 'openaccount.htm' },
  { text: 'Accounts Overview', href: 'overview.htm' },
  { text: 'Transfer Funds', href: 'transfer.htm' },
  { text: 'Bill Pay', href: 'billpay.htm' },
  { text: 'Find Transactions', href: 'findtrans.htm' },
  { text: 'Update Contact Info', href: 'updateprofile.htm' },
  { text: 'Request Loan', href: 'requestloan.htm' },
  { text: 'Log Out', href: 'index.htm' }
];

test.beforeAll(() => {
   console.log("Setting up global credentials for tests");
});

test.describe('Parabank Sidebar Links', () => {
  test.beforeEach(async ({ page }) => {
    await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
    await expect(page).toHaveURL(/overview.htm/);
  });

  for (const link of links) {
    test(`Should navigate correctly when clicking '${link.text}'`, async ({ page }) => {
      await page.locator(`#leftPanel a`, { hasText: link.text }).click();
      await expect(page).toHaveURL(new RegExp(link.href));

      if (link.href === 'index.htm') {
        await page.goto(`${PARA_BANK_LINK}/parabank/index.htm`);
        await expect(page.locator('input[name="username"]')).toBeVisible();
      }
    });
  }
});
