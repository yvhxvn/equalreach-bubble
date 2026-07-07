import { expect, test } from '@playwright/test';
import { config } from '../helpers/config';
import { LoginPage } from '../pom/LoginPage';
import { safeClick } from '../helpers/utils';

test('proposal-signing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const PR_NAME = config.prName;
    const USER_FULLNAME = config.user.fullName;

    await page.goto(`${config.baseURL}`);
    await loginPage.login(config.user.email, config.user.password);

    await page.getByText('Proposals', { exact: true })
        .click();
    await page.getByRole('heading', { name: PR_NAME, exact: true })
        .click();
    await page.getByRole('button', { name: 'View Proposal' })
        .click();
    await page.locator('div').filter({ hasText: /^Sign & Next Steps$/ })
        .nth(1)
        .click();
    await page.getByRole('textbox', { name: 'Please enter your full name' })
        .click();
    await page.getByRole('textbox', { name: 'Please enter your full name' })
        .fill(USER_FULLNAME);
    await safeClick(page.getByRole('button', { name: 'Sign & Complete' }));
    
    await page.getByRole('button', { name: 'Confirm' })
        .click();
    await page.getByRole('textbox', { name: 'Choose options' })
        .click();
    await page.getByRole('treeitem', { name: 'Other' })
        .click();
    await page.getByRole('textbox', { name: 'Type here...' })
        .click();
    await page.getByRole('textbox', { name: 'Type here...' })
        .fill('Testing signature');
    await safeClick(page.getByRole('button', { name: 'Send Feedback' }));

    await expect(page.getByRole('heading', { name: 'Congratulations!' }))
        .toBeVisible();
});