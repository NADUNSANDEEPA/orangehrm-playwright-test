const { test, expect } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { VacancyPage } = require('./poms/VacancyPage');
const { ORANGE_HRM_LINK } = require('../../config');

test.describe('OrangeHRM Recruitment - Vacancy Form', () => {
  let passCount = 0;
  let failCount = 0;
  const errors = [];
  const randomVacancy = `QA Vacancy ${Math.floor(Math.random() * 1000)}`;
  const url = `${ORANGE_HRM_LINK}/web/index.php/recruitment/addJobVacancy`;

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
    await loginUI(page, 'Admin', 'admin123');
    await page.goto(url);
    await expect(page.locator('text=Add')).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if(testInfo.status === 'passed') passCount++;
    else if(testInfo.status === 'failed'){
      failCount++;
      errors.push({ test: testInfo.title, error: testInfo.error.message });
    }
  });

  test.afterAll(() => {
    console.log(`Total Passed: ${passCount}`);
    console.log(`Total Failed: ${failCount}`);
    if(errors.length > 0){
      console.log('Errors details:');
      errors.forEach(e => console.log(`${e.test}: ${e.error}`));
    }
  });

  test('Test Case 01 : All Fields Empty', async ({page}) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.clickAdd();
    await vacancyPage.fillForm({
      name: '',
      jobTitle: '',
      description: '',
      manager: false,
      positions: '',
      active: true,
      publish: true
    });

    await expect(vacancyPage.page.locator('label:has-text("Vacancy Name") ~ .oxd-input-field-error-message')).toContainText('Required');
    await expect(vacancyPage.page.locator('label:has-text("Job Title") ~ .oxd-input-field-error-message')).toContainText('Required');
    await expect(vacancyPage.page.locator('label:has-text("Hiring Manager") ~ .oxd-input-field-error-message')).toContainText('Required');
  });

  test('Test Case 02: Successfully Save Vacancy', async ({page}) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.clickAdd();
    await vacancyPage.fillForm({
      name: randomVacancy,
      jobTitle: 'IT Manager', 
      description: 'Responsible for testing applications',
      manager: true,
      positions: '2',
      active: true,
      publish: true
    });
    await expect(page).toHaveURL(/addJobVacancy/, { timeout: 15000 });
  });

  test('Test Case 04: Positions - Should be a numeric value', async ({page}) => {
    const vacancyPage = new VacancyPage(page);
    await vacancyPage.clickAdd();
    await vacancyPage.fillForm({
      name: randomVacancy + 'X',
      jobTitle: 'IT Manager',
      description: 'Responsible for testing applications',
      manager: true,
      positions: 'a',
      active: true,
      publish: true
    });
    const errorMessage = await vacancyPage.getErrorMessage();
    expect(errorMessage).toContain('Should be a numeric value');
  });

});
