const { expect } = require('@playwright/test');

class LicensePage {
    constructor(page) {
        this.page = page;
        this.nameInput = page.locator('div.oxd-input-group:has(label:has-text("Name")) input.oxd-input');
        this.saveButton = page.locator('button:has-text("Save")');
        this.cancelButton = page.locator('button:has-text("Cancel")');
        this.errorMessage = page.locator('.oxd-input-field-error-message, .oxd-input-group__message');
        this.toast = page.locator('.oxd-toast');
    }

    async navigate(url) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async fillName(name) {
        await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.nameInput.fill(name);
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async getErrorMessage() {
        await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
        return this.errorMessage.textContent();
    }

    async waitForToast() {
        await expect(this.toast).toBeVisible({ timeout: 10000 });
        return this.toast.textContent();
    }
}

module.exports = { LicensePage };
