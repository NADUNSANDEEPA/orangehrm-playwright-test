const { SAUCEDEMO_LINK } = require("../../../config");

async function loginSauceDemo(page, username = 'standard_user', password = 'secret_sauce', isSuccess = true) {
  await page.goto(`${SAUCEDEMO_LINK}`);
  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');

  if (isSuccess) {
    await page.waitForURL(/\/inventory\.html/);
    await page.waitForSelector('.title');
  }
}

module.exports = { loginSauceDemo };
