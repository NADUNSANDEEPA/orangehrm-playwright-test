const { test, expect } = require('@playwright/test');
const { GlobalCredentialsForBank } = require('./GlobalCredentialsForBank');
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

let passCount = 0;
let failCount = 0;
const errors = [];
const testTimes = [];

test.beforeAll(() => {
  console.log("===== Starting Parabank Sidebar Links Test Suite =====");
});

test.describe('Parabank Sidebar Links', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.startTime = performance.now();
    await loginParabank(page, GlobalCredentialsForBank.getUsername(), GlobalCredentialsForBank.getPassword());
    await expect(page).toHaveURL(/overview.htm/);
  });

  test.afterEach(async ({ }, testInfo) => {
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

  test.afterAll(() => {
    console.log("===== TEST SUMMARY =====");
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    const total = passCount + failCount;
    console.log(`Success Rate: ${total ? ((passCount / total) * 100).toFixed(2) : 0}%`);
    console.log("Detailed timings:");
    testTimes.forEach(t => console.log(`- ${t.testName}: ${t.time}ms [${t.status}]`));
    if (errors.length > 0) {
      console.log("Errors captured during test run:");
      errors.forEach(err => console.log(`- ${err.test}: ${err.error}`));
    }
    console.log("===== Finished Parabank Sidebar Links =====");
  });

  links.forEach((link, index) => {
    test(`Test Case ${String(index + 1).padStart(2, '0')} : Should navigate correctly when clicking '${link.text}'`, async ({ page }) => {
      await page.getByRole('link', { name: link.text }).click();
      const hrefPattern = new RegExp(`${link.href.replace('.', '\\.')}(\\?.*)?$`);

      await expect(page).toHaveURL(hrefPattern);

      if (link.href === 'index.htm') {
        await expect(page.locator('input[name="username"]')).toBeVisible();
      } else {
        await expect(page.locator('body')).toContainText(link.text.split(' ')[0]);
      }
    });
  });

});
