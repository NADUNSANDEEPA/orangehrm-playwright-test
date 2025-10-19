const { expect } = require('@playwright/test');

class EmployeeStatusPage {
    constructor(page) {
        this.page = page;
        this.nameInput = page.locator(
            'div.oxd-input-group:has(label:has-text("Name")) input.oxd-input'
        );
        this.saveButton = page.locator('button:has-text("Save")');
        this.errorMessage = page.locator('.oxd-input-field-error-message');
    }

    async navigate(url) {
        await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await this.nameInput.waitFor({ state: 'visible', timeout: 15000 });
    }

    async fillStatusForm({ name }) {
        await this.nameInput.fill(name);
        await Promise.all([
            this.saveButton.click()
        ]);
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

module.exports = { EmployeeStatusPage };
