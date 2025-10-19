const { test, expect } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { VacancyPage } = require('./poms/VacancyPage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe.serial('OrangeHRM Recruitment - Vacancy Form', () => {
  let passCount = 0;
  let failCount = 0;
  const errors = [];
  const randomVacancy = `QA Vacancy ${Math.floor(Math.random() * 1000)}`;
  const url = `${ORANGE_HRM_LINK}/web/index.php/recruitment/addJobVacancy`;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`\n🔹 Starting test: ${testInfo.title}`);
    await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
    await loginUI(page, 'Admin', 'admin123');

    await page.goto(url, { waitUntil: 'networkidle' });
    await expect(page.locator('button:has-text("Save")')).toBeVisible({ timeout: 15000 });
  });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status === 'passed') passCount++;
    else if (testInfo.status === 'failed') {
      failCount++;
      errors.push({ test: testInfo.title, error: testInfo.error.message });
    }
  });

  test.afterAll(() => {
    console.log(`\n✅ Total Passed: ${passCount}`);
    console.log(`❌ Total Failed: ${failCount}`);
    if (errors.length > 0) {
      console.log('\n📋 Error Details:');
      errors.forEach(e => console.log(`- ${e.test}: ${e.error}`));
    }
  });

  test('Test Case 01: All Fields Empty', async ({ page }) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.fillForm({
      name: '',
      jobTitle: '',
      description: '',
      manager: false,
      positions: '',
      active: true,
      publish: true
    });

    const nameError = page.locator('.oxd-input-group:has(label:has-text("Vacancy Name")) .oxd-input-field-error-message');
    const jobTitleError = page.locator('.oxd-input-group:has(label:has-text("Job Title")) .oxd-input-field-error-message');
    const managerError = page.locator('.oxd-input-group:has(label:has-text("Hiring Manager")) .oxd-input-field-error-message');

    await expect(nameError).toBeVisible({ timeout: 10000 });
    await expect(nameError).toContainText('Required');
    await expect(jobTitleError).toContainText('Required');
    await expect(managerError).toContainText('Required');
  });

  test('Test Case 02: Successfully Save Vacancy', async ({ page }) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.fillForm({
      name: `Vacancy-${Date.now()}`,
      jobTitle: 'IT Manager',
      description: 'Responsible for testing applications',
      manager: true,
      positions: '2',
      active: true,
      publish: true
    });

    await Promise.all([
      page.locator('button:has-text("Save")').click()
    ]);
  });

  test('Test Case 03: Positions - Should be a numeric value', async ({ page }) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.fillForm({
      name: randomVacancy + 'X',
      jobTitle: 'IT Manager',
      description: 'Responsible for testing applications',
      manager: true,
      positions: 'abc',
      active: true,
      publish: true
    });

    const errorMessage = await vacancyPage.getErrorMessage();
    expect(errorMessage).toContain('Should be a numeric value');
  });
});
