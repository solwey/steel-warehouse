import { test, expect } from '@playwright/test';
import { routes, org, todo, user } from '../config';
import { clearDB } from '../prisma';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Todo Tests', () => {
  test.afterAll(async ({ page }) => {
    await clearDB();
  });

  test.beforeAll(async ({ page, request }) => {
    //create org
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill(org.orgTodo);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();

    //go to dashboard
    await page.getByRole('link', { name: 'orgTodo Role: OWNER Click Go' }).click();
    await page.getByRole('link', { name: 'Todos' }).click();

    //create Todo
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill(todo.todoTitle);
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill(todo.todoDescription);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await expect(page.getByLabel('Description')).toBeEmpty();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'orgTodo Role: OWNER Click Go' }).click();
    await page.getByRole('link', { name: 'Todos' }).click();
  });

  test('My Todos', async ({ page }) => {
    await page.getByRole('link', { name: 'My Todos' }).click();
    await expect(page.locator('h3')).toContainText('todo1');
    await expect(page.getByRole('main')).toContainText('todo description 1');
  });

  test('List Todos', async ({ page }) => {
    await page.getByRole('link', { name: 'All Todos' }).click();
    await expect(page.locator('h3')).toContainText('todo1');
    await expect(page.getByRole('main')).toContainText('todo description 1');
  });

  test('Edit Todo', async ({ page }) => {
    await page.getByRole('link', { name: 'My Todos' }).click();
    await page.getByRole('link', { name: 'Edit' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('todo1 EDIT');
    await page.getByLabel('Description').click();
    await page.getByLabel('Description').fill('todo description 1 EDIT');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('h3')).toContainText('New Todo');
    await page.getByRole('link', { name: 'My Todos' }).click();
    await page.reload();
    await expect(page.locator('h3')).toContainText('todo1 EDIT');
    await expect(page.getByRole('main')).toContainText('todo description 1 EDIT');
  });

  test('Delete Todo', async ({ page }) => {
    await page.getByRole('link', { name: 'My Todos' }).click();
    await page.getByRole('link', { name: 'My Todos' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('main')).toContainText('No Todos Found');
    await page.getByRole('link', { name: 'All Todos' }).click();
    await expect(page.getByRole('main')).toContainText('No Todos Found');
  });
});
