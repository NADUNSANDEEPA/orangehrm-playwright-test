const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { SidebarPage } = require('./poms/SidebarPage');

let passCount = 0;
let failCount = 0;
const testTimes = [];
const errors = [];

test.beforeAll(() => {
  console.log("===== Starting SauceDemo Sidebar Links Test Suite =====");
});

test.describe('SauceDemo Sidebar Links', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.startTime = performance.now();
    await loginSauceDemo(page);
    const sidebar = new SidebarPage(page);
    await sidebar.openMenu();
    test.info().annotations.push({ type: 'sidebar', description: 'Sidebar opened successfully' });
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

    console.log(`Test "${testName}" completed in ${duration}ms [${status}]`);
  });

  test('Test Case 01 : All Items link works', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await expect(sidebar.allItemsLink).toBeVisible();
    await sidebar.clickAllItems();
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('Test Case 02 : About link works', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await expect(sidebar.aboutLink).toBeVisible();
    const href = await sidebar.getAboutLinkHref();
    expect(href).toBe('https://saucelabs.com/');
  });

  test('Test Case 03 : Logout link works', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await expect(sidebar.logoutLink).toBeVisible();
    await sidebar.clickLogout();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Test Case 04 : Reset App State link works', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await expect(sidebar.resetAppStateLink).toBeVisible();
    await sidebar.clickResetAppState();
    await expect(sidebar.shoppingCartBadge).toHaveCount(0);
  });

  test.afterAll(() => {
    const totalTimeMs = testTimes.reduce((sum, t) => sum + parseFloat(t.time), 0);
    const totalTimeSec = (totalTimeMs / 1000).toFixed(2);

    console.log("\n===== TEST SUMMARY =====");
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    const total = passCount + failCount;
    console.log(`Success Rate: ${total ? ((passCount / total) * 100).toFixed(2) : 0}%`);
    console.log(`\nTotal Execution Time: ${totalTimeMs.toFixed(2)}ms (${totalTimeSec}s)`);

    console.log("\nTest Durations:");
    testTimes.forEach(t => console.log(`- ${t.testName}: ${t.time}ms [${t.status}]`));

    if (errors.length > 0) {
      console.log("\nErrors captured during test run:");
      errors.forEach(err => console.log(`- ${err.test}: ${err.error}`));
    }

    console.log('===== Finished all SauceDemo sidebar link tests =====');
  });

});
