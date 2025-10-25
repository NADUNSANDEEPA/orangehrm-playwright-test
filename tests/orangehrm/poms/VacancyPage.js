const { expect } = require('@playwright/test');

class VacancyPage {
  constructor(page) {
    this.page = page;

    // --- Input fields ---
    this.vacancyNameInput = page.locator('div.oxd-input-group:has(label:has-text("Vacancy Name")) input.oxd-input');
    this.jobTitleDropdown = page.locator('div.oxd-input-group:has(label:has-text("Job Title")) .oxd-select-wrapper');
    this.descriptionInput = page.locator('div.oxd-input-group:has(label:has-text("Description")) textarea.oxd-textarea');
    this.managerInput = page.locator('div.oxd-input-group:has(label:has-text("Hiring Manager")) input[placeholder="Type for hints..."]');
    this.managerOption = page.locator('.oxd-autocomplete-option');
    this.positionsInput = page.locator('div.oxd-input-group:has(label:has-text("Number of Positions")) input.oxd-input');
    this.activeCheckbox = page.locator('text=Active').locator('..').locator('input[type="checkbox"]');
    this.publishCheckbox = page.locator('text=Publish in RSS Feed and Web Page').locator('..').locator('input[type="checkbox"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.errorMessage = page.locator('.oxd-input-field-error-message, .oxd-input-group__message');
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async fillForm({ name, jobTitle, description, manager, positions, active = true, publish = false }) {

    // --- Vacancy name ---
    if (name !== undefined) {
      await this.vacancyNameInput.fill(name);
    }

    // --- Job Title dropdown ---
    if (jobTitle) {
      await this.jobTitleDropdown.click();
      await this.page.waitForTimeout(1500);
      const jobOption = this.page.locator(`.oxd-select-dropdown >> text=${jobTitle}`);
      await expect(jobOption).toBeVisible({ timeout: 10000 });
      await jobOption.click();
    }

    // --- Description ---
    if (description) {
      await this.descriptionInput.fill(description);
    }

    // --- Hiring Manager ---
    if (manager) {
      await this.managerInput.fill("a");
      await this.page.waitForSelector('.oxd-autocomplete-option', { timeout: 50000 });
      await this.managerOption.first().click();
    }

    // --- Positions ---
    if (positions !== undefined) {
      await this.positionsInput.fill(String(positions));
    }

    // --- Active checkbox ---
    if (active) {
      if (!await this.activeCheckbox.isChecked()) await this.activeCheckbox.check();
    } else {
      if (await this.activeCheckbox.isChecked()) await this.activeCheckbox.uncheck();
    }

    // --- Publish checkbox ---
    if (publish) {
      if (!await this.publishCheckbox.isChecked()) await this.publishCheckbox.check();
    } else {
      if (await this.publishCheckbox.isChecked()) await this.publishCheckbox.uncheck();
    }

    // --- Save ---
    await Promise.all([
      this.page.waitForResponse(res => res.url().includes('/vacancy') && res.status() === 200, { timeout: 20000 }).catch(() => null),
      this.saveButton.click()
    ]);
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    return this.errorMessage.textContent();
  }
}

module.exports = { VacancyPage };
