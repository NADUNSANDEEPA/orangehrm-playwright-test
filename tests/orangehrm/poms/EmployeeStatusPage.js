const { expect } = require('@playwright/test');

class EmployeeStatusPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('label:has-text("Name")')
      .locator('xpath=../following-sibling::div//input');
    this.saveButton = page.locator('button:has-text("Save")');
    this.errorMessage = page.locator('.oxd-input-field-error-message');
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await expect(this.nameInput).toBeVisible({ timeout: 10000 });
  }

  async fillStatusForm({ name }) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    return this.errorMessage.textContent();
  }
}

module.exports = { EmployeeStatusPage };
