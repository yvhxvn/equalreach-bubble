import { test } from '@playwright/test';
import { config } from '../helpers/config';
import { LoginPage } from '../pom/LoginPage';
import { safeClick } from '../helpers/utils';

test('dp-submission', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const PR_NAME = config.prName;
    const DP_FULLNAME = config.dp.fullName;
    const lorem = 'Lorem ipsum.';

    await page.goto(`${config.baseURL}`);
    await loginPage.login(config.dp.email, config.dp.password);

    await page.getByText('Proposals', { exact: true })
        .click();
    await page.getByRole('button', { name: 'Review Project Request' })
        .first()    
        .click();

    await page.getByRole('button', { name: 'Accept' })
        .click();
    await page.getByRole('button', { name: 'Accept the Request' })
        .click();

    await page.getByRole('button', { name: 'Start Proposal' })
        .click();

    await page.waitForTimeout(1000);
    await page.locator('.bubble-element.TableCell.a1778832614642x705836671676668300')
        .first()
        .click();
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^Lorem Ipsum$/ })
        .nth(2)
        .click({ force: true });
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^Test$/ })
        .first()
        .click({ force: true });
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^test$/ })
        .first()
        .click({ force: true });
    await page.waitForTimeout(1000);

    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.locator('#richtext-editor-3 > .ql-editor')
        .click()
    await page.locator('#richtext-editor-3 > .ql-editor')
        .fill(lorem);
    await page.locator('#richtext-editor-4 > .ql-editor')
        .click()
    await page.locator('#richtext-editor-4 > .ql-editor')
        .fill(lorem);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.getByRole('button', { name: 'Add Service' })
        .click();
    await page.getByRole('textbox', { name: 'Consulting' })
        .click();
    await page.getByRole('textbox', { name: 'Consulting' })
        .pressSequentially('test service', { delay: 50 });

    await page.locator('#richtext-editor-5 > .ql-editor')
        .click();
    await page.locator('#richtext-editor-5 > .ql-editor')
        .fill(lorem);

    await page.locator('div')
        .filter({ hasText: /^Fixed Price$/ })
        .nth(1)
        .click();

    await page.getByRole('textbox', { name: '£' })
        .click();
    await page.getByRole('textbox', { name: '£' })
        .pressSequentially('500', { delay: 50 });
    await page.getByRole('textbox', { name: '120' })
        .click();
    await page.getByRole('textbox', { name: '120' })
        .pressSequentially('5', { delay: 50 });
    await page.getByText('100% upfront')
        .click();
    await page.waitForTimeout(800);
    await safeClick(page.getByRole('button', { name: 'Save Service' }));
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.getByRole('textbox', { name: 'Choose KPI' })
        .click();
    await page.getByRole('treeitem', { name: 'Conversion Rate: Donation' })
        .click();
    await page.waitForTimeout(500);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));

    await page.getByRole('textbox', { name: '/07/2026' })
        .click();
    await page.getByRole('button', { name: 'Today' })
        .click();
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Type here...' })
        .click();
    await page.getByRole('textbox', { name: 'Type here...' })
        .pressSequentially('1', { delay: 50 });
    await page.waitForTimeout(300);

    await page.getByRole('combobox')
        .selectOption('day(s)');
    await page.waitForTimeout(300);

    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));
    await page.waitForTimeout(100);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));
    await page.waitForTimeout(100);
    await safeClick(page.getByRole('button', { name: 'Save & Continue' }));
    await page.waitForTimeout(100);

    await page.getByRole('button', { name: 'Services Agreement' }) 
        .click();
    await page.getByText('28. Jurisdiction')
        .scrollIntoViewIfNeeded();

    await page.getByRole('textbox', { name: 'Sign here...' })
        .click();
    await page.getByRole('textbox', { name: 'Sign here...' })
        .fill(DP_FULLNAME);
    await safeClick(page.getByRole('button', { name: 'Agree & Sign' }));
    await page.waitForTimeout(500);
    await safeClick(page.getByRole('button', { name: 'Submit Proposal' }));
    await page.waitForTimeout(500);
    await safeClick(page.getByRole('button', { name: 'Accept & Submit' }));

    await page.waitForURL('https://app.equalreach.io/version-test/dp/proposals', { timeout: 15000 });

});