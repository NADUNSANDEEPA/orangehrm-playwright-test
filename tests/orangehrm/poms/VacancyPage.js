const { expect } = require('@playwright/test');

class VacancyPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.locator('text=Add');
    this.nameInput = page.locator('input[name="name"]');
    this.jobTitleDropdown = page.locator('.oxd-select-wrapper');
    this.jobTitleOption = (title) => page.locator('.oxd-select-dropdown >> text=' + title);
    this.descriptionInput = page.locator('textarea[placeholder="Type description here"]');
    this.managerInput = page.locator('input[placeholder="Type for hints..."]');
    this.managerOption = page.locator('.oxd-autocomplete-option').first();
    this.positionsInput = page.locator('input[name="numberOfPositions"]');
    this.activeCheckbox = page.locator('text=Active').locator('..').locator('input[type="checkbox"]');
    this.publishCheckbox = page.locator('text=Publish in RSS Feed and Web Page').locator('..').locator('input[type="checkbox"]');
    this.saveButton = page.locator('button[type="submit"]').filter({ hasText: 'Save' });
    this.errorMessage = page.locator('.oxd-input-field-error-message, .oxd-input-group__message');
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  }

  async clickAdd() {
    await this.addButton.click();
  }

  async fillForm({ name, jobTitle, description, manager, positions, active = true, publish = false }) {
    if(name !== undefined) await this.nameInput.fill(name);
    
    if(jobTitle) {
      await this.jobTitleDropdown.click();
      await this.jobTitleOption(jobTitle).click();
    }

    if(description) {
      await this.descriptionInput.fill(description);
    }

    if(manager) {
      await this.managerInput.fill('a'); // Start typing something for autocomplete
      await this.managerOption.click();
    }

    if(positions !== undefined) {
      await this.positionsInput.fill(positions);
    }

    if(active) {
      if(!await this.activeCheckbox.isChecked()) await this.activeCheckbox.check();
    } else {
      if(await this.activeCheckbox.isChecked()) await this.activeCheckbox.uncheck();
    }

    if(publish) {
      if(!await this.publishCheckbox.isChecked()) await this.publishCheckbox.check();
    } else {
      if(await this.publishCheckbox.isChecked()) await this.publishCheckbox.uncheck();
    }

    await this.saveButton.click();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    return this.errorMessage.textContent();
  }
}

module.exports = { VacancyPage };
