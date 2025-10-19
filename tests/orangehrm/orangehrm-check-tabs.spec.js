const { test } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { PersonalDetailsPage } = require('./poms/PersonalDetailsPage');
const { ORANGE_HRM_LINK } = require('../../config');

const tabs = [
    'Personal Details', 'Contact Details', 'Emergency Contacts', 'Dependents', 'Immigration',
    'Job', 'Salary', 'Salary', 'Report-to', 'Qualifications', 'Memberships'
];

test.describe('OrangeHRM Check Tabs', () => {
    let passCount = 0;
    let failCount = 0;
    const errors = [];

    test.beforeAll(() => {
        console.log('Starting OrangeHRM Check Tabs Test Suite');
    });

    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Starting test: ${testInfo.title}`);
        await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
        await loginUI(page, 'Admin', 'admin123');
        await page.goto(`${ORANGE_HRM_LINK}/web/index.php/pim/viewPersonalDetails/empNumber/7`);
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status === 'passed') passCount++;
        else if (testInfo.status === 'failed') {
            failCount++;
            errors.push({ test: testInfo.title, error: testInfo.error.message });
        }
    });

    test.afterAll(() => {
        console.log(`Total Passed: ${passCount}`);
        console.log(`Total Failed: ${failCount}`);
        if (errors.length > 0) {
            console.log('Errors details:');
            errors.forEach(e => console.log(`${e.test}: ${e.error}`));
        }
    });

    for (const [index, tabName] of tabs.entries()) {
        test(`Test Case ${index + 1} - Should open ${tabName} tab`, async ({ page }) => {
            const personalDetails = new PersonalDetailsPage(page);
            await personalDetails.waitForTabs();
            await personalDetails.clickTab(tabName);
            await personalDetails.verifyUrlMatchesTab(tabName);
        });
    }
});
