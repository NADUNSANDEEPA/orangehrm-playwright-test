const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.alertContent = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('div.orangehrm-login-forgot');
    // Target second copyright element to avoid strict mode error
    this.footer = page.locator('.orangehrm-copyright').nth(1);
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  }

  async footerContainsTexts(...texts) {
    const text = await this.footer.textContent();
    for (const t of texts) {
      if (!text.includes(t)) throw new Error(`Footer does not contain expected text: ${t}`);
    }
  }

  async footerLinkHasAttributes(href, target, linkText) {
    const link = this.footer.locator('a');
    await expect(link).toHaveAttribute('href', href, { timeout: 5000 });
    await expect(link).toHaveAttribute('target', target, { timeout: 5000 });
    await expect(link).toContainText(linkText, { timeout: 5000 });
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}

module.exports = { LoginPage };
