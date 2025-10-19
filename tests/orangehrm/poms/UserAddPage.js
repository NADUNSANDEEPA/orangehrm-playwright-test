const { expect } = require('@playwright/test');

class UserAddPage {
  constructor(page) {
    this.page = page;
    this.userRoleDropdown = page.locator('div.oxd-input-group:has(label:has-text("User Role")) .oxd-select-wrapper');
    this.employeeNameInput = page.locator('div.oxd-input-group:has(label:has-text("Employee Name")) input[placeholder="Type for hints..."]');
    this.statusDropdown = page.locator('div.oxd-input-group:has(label:has-text("Status")) .oxd-select-wrapper');
    this.usernameInput = page.locator('div.oxd-input-group:has(label:has-text("Username")) input.oxd-input');
    this.passwordInput = page.locator('div.oxd-input-group:has(label:has-text("Password")) input[type="password"]').first();
    this.confirmPasswordInput = this.page.locator('div.oxd-input-group:has(label:has-text("Confirm Password")) input[type="password"]').first()
    this.saveButton = page.locator('button:has-text("Save")');

    this.autocompleteOption = page.locator('.oxd-autocomplete-option').first();
    this.errorMessages = page.locator('.oxd-input-group__message, .oxd-input-field-error-message');
  }

  async selectUserRole(role) {
    if (role) {
      await this.userRoleDropdown.click();
      await this.page.waitForSelector(`.oxd-select-dropdown >> text=${role}`, { timeout: 10000 });
      await this.page.locator(`.oxd-select-dropdown >> text=${role}`).click();
    }
  }

  async selectStatus(status) {
    if (status) {
      await this.statusDropdown.click();
      await this.page.waitForSelector(`.oxd-select-dropdown >> text=${status}`, { timeout: 10000 });
      await this.page.locator(`.oxd-select-dropdown >> text=${status}`).click();
    }
  }

  async fillEmployeeName(name) {
    var empName = "a";
    if (name) {
      await this.employeeNameInput.fill(empName.charAt(0));
      await this.page.waitForTimeout(1500);
      await this.page.waitForSelector('.oxd-autocomplete-option', { timeout: 10000 });
      await this.autocompleteOption.click();
    } else {
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
      await confirmPasswordInput.waitFor({ state: 'visible', timeout: 10000 });
      await confirmPasswordInput.fill(confirmPassword);
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
