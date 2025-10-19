const { expect } = require('@playwright/test');

class UserAddPage {
  constructor(page) {
    this.page = page;
    this.userRoleDropdown = page.locator('label:text("User Role")').locator('..').locator('.oxd-select-wrapper');
    this.statusDropdown = page.locator('label:text("Status")').locator('..').locator('.oxd-select-wrapper');
    this.employeeNameInput = page.locator('label:text("Employee Name")').locator('..').locator('input[placeholder="Type for hints..."]');
    this.employeeNameAutocompleteOption = page.locator('.oxd-autocomplete-option').first();
    this.usernameInput = page.locator('label:text("Username")').locator('..').locator('input[autocomplete="off"]');
    this.passwordInput = page.locator('label:text("Password")').locator('..').locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('label:text("Confirm Password")').locator('..').locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button:has-text("Save")');
    this.errorMessages = page.locator('.oxd-input-group__message, .oxd-input-field-error-message, .oxd-select-text--error, .oxd-autocomplete-text-input--error');
  }

  async selectUserRole(role) {
    if (role) {
      await this.userRoleDropdown.click();
      await this.page.locator('.oxd-select-dropdown').locator(`text=${role}`).click();
    }
  }

  async selectStatus(status) {
    if (status) {
      await this.statusDropdown.click();
      await this.page.locator('.oxd-select-dropdown').locator(`text=${status}`).click();
    }
  }

  async fillEmployeeName(name) {
    if (name !== false && name !== '') {
      await this.employeeNameInput.fill(name.substring(0, 1));
      await this.employeeNameAutocompleteOption.waitFor({ state: 'visible', timeout: 5000 });
      await this.employeeNameAutocompleteOption.click();
    } else if (name === false) {
      await this.employeeNameInput.fill('');
    }
  }

  async fillUsername(username) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
  }

  async fillPassword(password) {
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
  }

  async fillConfirmPassword(confirmPassword) {
    if (confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(confirmPassword);
    }
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async fillForm({ userRole, employeeName, status, username, password, confirmPassword }) {
    await this.selectUserRole(userRole);
    await this.fillEmployeeName(employeeName);
    await this.selectStatus(status);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickSave();
  }

  async errorMessagesContain(text) {
    await expect(this.errorMessages).toContainText(text, { timeout: 10000 });
  }

  async errorMessageCountAtLeast(count) {
    await expect(this.errorMessages).toHaveCount(count, { timeout: 10000 });
  }
}

module.exports = { UserAddPage };
