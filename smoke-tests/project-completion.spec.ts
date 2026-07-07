import { expect, test } from '@playwright/test';
import { config } from '../helpers/config';
import { LoginPage } from '../pom/LoginPage';

test('project-completion', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const PR_NAME = config.prName;

    await page.goto(`${config.baseURL}`);
    await loginPage.login(config.user.email, config.user.password);

    await page.getByText('Projects', { exact: true })
        .click();
    await page.getByRole('textbox', { name: 'Enter project name' })
        .click();
    await page.getByRole('textbox', { name: 'Enter project name' })
        .pressSequentially(PR_NAME, { delay: 100 });
    await page.locator('span')
        .nth(1)
        .click();
    await page.getByRole('button', { name: 'View Details' })
        .first()
        .click();
    const newpagePromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'View Details' })
        .first()
        .click();
    const newpage = await newpagePromise;
    await newpage.getByRole('button', { name: 'Initiate Project Completion' })
        .click();
    await newpage.getByRole('button', { name: 'Mark all services as complete' })
        .click();
    await newpage.getByRole('button', { name: 'Yes' })
        .click();
    await newpage.getByRole('button', { name: 'Close' })
        .click();
    await newpage.getByRole('button', { name: 'Complete Project' })
        .click();
    await expect(newpage.getByText('Project Completion Started'))
        .toBeVisible();
});