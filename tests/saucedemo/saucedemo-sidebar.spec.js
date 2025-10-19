const { test, expect } = require('@playwright/test');
const { loginSauceDemo } = require('./helpers/loginHelper');
const { SidebarPage } = require('./poms/SidebarPage');

test.describe('SauceDemo Sidebar Links', () => {

  test.beforeEach(async ({ page }) => {
    await loginSauceDemo(page);
    const sidebar = new SidebarPage(page);
    await sidebar.openMenu();
    test.info().annotations.push({ type: 'sidebar', description: sidebar });
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

});
