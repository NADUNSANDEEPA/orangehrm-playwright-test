const { expect } = require('@playwright/test');
const path = require('path');

class JobTitlePage {
  constructor(page) {
    this.page = page;
    this.form = page.locator('form.oxd-form');
    this.jobTitleInput = page.locator('label.oxd-label:has-text("Job Title")').locator('xpath=../following-sibling::div//input');
    this.jobDescriptionInput = page.locator('label.oxd-label:has-text("Job Description")').locator('xpath=../following-sibling::div//textarea');
    this.jobSpecFileInput = page.locator('label.oxd-label:has-text("Job Specification")').locator('xpath=../following-sibling::div//input[@type="file"]');
    this.noteInput = page.locator('label.oxd-label:has-text("Note")').locator('xpath=../following-sibling::div//textarea');
    this.saveButton = page.locator('button.oxd-button--secondary[type="submit"]');
    this.successMessage = page.locator('text=Successfully Saved');
    this.errorMessage = page.locator('.oxd-input-field-error-message');
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await expect(this.form).toBeVisible({ timeout: 10000 });
  }

  async fillForm({ jobTitle, jobDescription, jobSpecificationFile, note }) {
    if (jobTitle !== undefined) await this.jobTitleInput.fill(jobTitle);
    if (jobDescription !== undefined) await this.jobDescriptionInput.fill(jobDescription);
    if (jobSpecificationFile) {
      const filePath = path.resolve(__dirname, jobSpecificationFile);
      await this.jobSpecFileInput.setInputFiles(filePath);
    }
    if (note !== undefined) await this.noteInput.fill(note);
  }

  async submit() {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
  }

  async expectError(text) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage).toContainText(text);
  }
}

module.exports = { JobTitlePage };
