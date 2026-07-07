import { test, expect } from '@playwright/test';
import { config } from '../helpers/config';
import { LoginPage } from '../pom/LoginPage';
import { DescriptionPage } from '../pom/DescriptionPage';
import { generateProjectName } from '../helpers/utils';
import { safeClick } from '../helpers/utils';
import fs from 'fs';
import path from 'path/win32';

test('pr-creation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(`${config.baseURL}`);
    await loginPage.login(config.user.email, config.user.password);

    await page.getByRole('button', { name: 'New Project Request' })
        .click();
    const projectName = generateProjectName();
    await page.getByRole('textbox', { name: 'Website Creation' })
        .pressSequentially (projectName, { delay: 50 });
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.getByRole('textbox', { name: 'Choose Category' })
        .click();
    await page.getByRole('treeitem', { name: 'AI/ML' })
        .click();
    await page.getByRole('textbox', { name: 'Start typing to search or add' })
        .click();
    await page.getByRole('treeitem', { name: '2D Animation' })
        .click();
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.locator('div')
        .filter({ hasText: /^SmallQuick tasks, low complexity \(e\.g\. design a logo for a product\)$/ })
        .nth(1)
        .click();
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.locator('div').filter({ hasText: /^Fixed Price$/ })
        .nth(1)
        .click();
    await page.waitForTimeout(800);
    await page.getByRole('textbox', { name: '500' })
        .fill('500');
    await page.getByRole('textbox', { name: '800' })
        .fill('800');
    await expect(page.getByRole('textbox', { name: '500' }))
    .toHaveValue('500');
    await expect(page.getByRole('textbox', { name: '800' }))
    .toHaveValue('800');
    await page.waitForTimeout(800);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    const descriptionPage = new DescriptionPage(page);
    const lorem = 'Lorem ipsum.';
    await descriptionPage
        .fillDescriptionByIndex(0, lorem);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await descriptionPage
        .fillDescriptionByIndex(1, lorem);
    await descriptionPage
        .fillDescriptionByIndex(2, lorem);
    await page.waitForTimeout(800);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await safeClick(page.getByRole('button', { name: 'Submit Project Request' }));

    await expect(page.getByRole('heading', { name: 'Thanks for Submitting!' }))
        .toBeVisible();
    fs.writeFileSync(path.join(__dirname, '../pr-name.txt'), projectName, 'utf-8');
    console.log(`Done: ${projectName} created successfully`);
});