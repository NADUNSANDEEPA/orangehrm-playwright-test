const { test } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { JobTitlePage } = require('./poms/JobTitlePage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe('OrangeHRM Job Title Form', () => {
  const url = `${ORANGE_HRM_LINK}/web/index.php/admin/saveJobTitle`;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`, { timeout: 30000 });
    await loginUI(page, 'Admin', 'admin123');
    await page.goto(url, { timeout: 30000 });
  });

  test('Test Case 01 : Should add a new Job Title successfully', async ({ page }) => {
    const jobTitlePage = new JobTitlePage(page);
    await jobTitlePage.fillForm({
      jobTitle: 'Automation Engineer - Grade ' + Math.floor(Math.random() * 1000),
      jobDescription: 'Responsible for automation testing',
      jobSpecificationFile: '../files/sample-spec.pdf',
      note: 'Test note for job title',
    });
    await jobTitlePage.submit();
    await jobTitlePage.expectSuccess();
  }, { retries: 2 });

  test('Test Case 02 : Should show validation error for empty required fields', async ({ page }) => {
    const jobTitlePage = new JobTitlePage(page);
    await jobTitlePage.fillForm({
      jobTitle: '',
      jobDescription: 'Responsible for automation testing',
      jobSpecificationFile: '../files/sample-spec.pdf',
      note: 'Test note for job title',
    });
    await jobTitlePage.submit();
    await jobTitlePage.expectError('Required');
  });
});
