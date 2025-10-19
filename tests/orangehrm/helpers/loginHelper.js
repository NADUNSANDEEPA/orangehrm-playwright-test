const { expect } = require('@playwright/test');

async function loginUI(page, username, password) {
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForURL(/dashboard/, { waitUntil: 'networkidle', timeout: 60000 }),
    page.click('button[type="submit"]')
  ]);
  await expect(page).toHaveURL(/dashboard/);
}


module.exports = { loginUI };
