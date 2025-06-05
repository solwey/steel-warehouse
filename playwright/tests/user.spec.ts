import { test, expect } from '@playwright/test';
import { routes, user } from '../config';
import { clearDB } from '../prisma';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('User Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.urls.UserDashboard);
  });

  test.afterAll(async ({ page }) => {
    await clearDB();
  });

  test('Create Org', async ({ page }) => {
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('org123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await expect(page.locator('h3')).toContainText('org123');
  });

  test('Update User Email', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').press('ArrowUp');
    await page.getByLabel('Email').fill('admintest4@yahoo.com');
    await page.getByRole('button', { name: 'Update Email' }).click();
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByLabel('Email')).toHaveValue('admintest4@yahoo.com');
  });

  test('Update User DisplayName', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByLabel('Display Name').click();
    await page.getByLabel('Display Name').fill('testuser123');
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByLabel('Display Name')).toHaveValue('testuser123');
  });
});
