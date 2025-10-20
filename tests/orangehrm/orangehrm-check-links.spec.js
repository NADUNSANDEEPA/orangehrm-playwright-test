const { test } = require('@playwright/test');
const { loginUI } = require('./helpers/loginHelper');
const { MainMenuPage } = require('./poms/MainMenuPage');
const { ORANGE_HRM_LINK } = require('../../config');

const mainMenuItems = [
    'Admin', 'PIM', 'Leave', 'Time', 'Recruitment',
    'My Info', 'Performance', 'Dashboard', 'Directory',
    'Maintenance', 'Claim', 'Buzz'
];

test.describe('OrangeHRM Menu Navigation Human-like Tests', () => {
    let passCount = 0;
    let failCount = 0;
    const errors = [];

    test.beforeAll(() => {
        console.log('Starting OrangeHRM Human-like Menu Navigation Tests');
    });

    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Starting test: ${testInfo.title}`);
        await page.goto(`${ORANGE_HRM_LINK}/web/index.php/auth/login`);
        await loginUI(page, 'Admin', 'admin123');
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
            console.log('Errors detail:');
            for (const e of errors) {
                console.log(`${e.test}: ${e.error}`);
            }
        }
    });

    for (const menu of mainMenuItems) {
        test(`Should open ${menu} page and verify visible content`, async ({ page }) => {
            const mainMenu = new MainMenuPage(page);
            await mainMenu.clickMenuItem(menu);
            await mainMenu.verifyNavigation(menu);
            await mainMenu.verifyNoErrors();
        });
    }
});
