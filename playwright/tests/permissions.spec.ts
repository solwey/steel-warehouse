import { test, expect } from '@playwright/test';
import { routes } from '../config';
import { clearDB } from '../prisma';

test.describe('Owner Tests', () => {
  test.afterAll(async () => {
    await clearDB();
  });

  test('Owner Permission Tests', async ({ page, request }) => {
    await page.goto(routes.urls.base);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.waitForURL(routes.segments.login);
    await page.getByPlaceholder('Email').fill('userOwnerTest@yahoo.com');
    await page.getByRole('button', { name: 'Login with Email' }).click();

    await page.waitForURL(routes.segments.authConfirm);
    await expect(page.getByRole('heading')).toContainText('Request Successfully Submitted');

    const emails = await request.get(routes.api.emails);
    const res = JSON.parse(await emails.text());
    const lastEmail = res.slice(-1)[0];
    const redirectUrl = lastEmail.text;

    await page.goto(redirectUrl);
    await page.waitForURL(routes.segments.userDash);

    //create org
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('OrgOwner');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();

    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'OrgOwner Role: OWNER Click Go' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('main')).toContainText('All Roles can See This');
    await expect(page.getByRole('main')).toContainText('Admin and Owner Roles can See This');
    await expect(page.getByRole('main')).toContainText('Only Owner can See This');
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});

test.describe('Admin Tests', () => {
  test.afterAll(async () => {
    await clearDB();
  });

  test('Admin Permission', async ({ page, request }) => {
    await page.goto(routes.urls.base);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.waitForURL(routes.segments.login);
    await page.getByPlaceholder('Email').fill('userAdminTest@yahoo.com');
    await page.getByRole('button', { name: 'Login with Email' }).click();

    await page.waitForURL(routes.segments.authConfirm);
    await expect(page.getByRole('heading')).toContainText('Request Successfully Submitted');

    const emails = await request.get(routes.api.emails);
    const res = JSON.parse(await emails.text());
    const lastEmail = res.slice(-1)[0];
    const redirectUrl = lastEmail.text;

    await page.goto(redirectUrl);
    await page.waitForURL(routes.segments.userDash);

    //create org
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('OrgAdminTest');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();

    //setup member role
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'OrgAdminTest Role: OWNER Click Go' }).click();
    await page.getByRole('link', { name: 'Invite' }).click();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('testadmin@yahoo.com');
    await page.getByLabel('Role').click();
    await page.getByLabel('ADMIN').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByPlaceholder('Email')).toBeEmpty();

    const emailsAdmin = await request.get(routes.api.emails);
    const resAdmin = JSON.parse(await emailsAdmin.text());
    const lastEmailAdmin = resAdmin.slice(-1)[0];
    const redirectUrlAdmin = lastEmailAdmin.text;

    //go to Admin dashboard
    await page.goto(redirectUrlAdmin);
    await page.waitForURL(routes.segments.userDash);
    await expect(page.getByRole('main')).toContainText('Setting Up Organization Finished');
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await expect(page.getByRole('paragraph')).toContainText('Role: ADMIN');
    await page.getByRole('link', { name: 'OrgAdminTest Role: ADMIN Click Go' }).click();
    await page.waitForURL('**/dashboard/**');
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('main')).toContainText('All Roles can See This');
    await expect(page.getByRole('main')).toContainText('Admin and Owner Roles can See This');
    await expect(page.getByText('Only Owner can See This')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});

test.describe('Member Tests', () => {
  test.afterAll(async ({ page }) => {
    await clearDB();
  });

  test('Member Permission', async ({ page, request }) => {
    await page.goto(routes.urls.base);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.waitForURL(routes.segments.login);
    await page.getByPlaceholder('Email').fill('userMemberTest@yahoo.com');
    await page.getByRole('button', { name: 'Login with Email' }).click();

    await page.waitForURL(routes.segments.authConfirm);
    await expect(page.getByRole('heading')).toContainText('Request Successfully Submitted');

    const emails = await request.get(routes.api.emails);
    const res = JSON.parse(await emails.text());
    const lastEmail = res.slice(-1)[0];
    const redirectUrl = lastEmail.text;

    await page.goto(redirectUrl);
    await page.waitForURL(routes.segments.userDash);

    //create org
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('OrgMemberTest');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();

    //setup member role
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'OrgMemberTest Role: OWNER Click Go' }).click();
    await page.getByRole('link', { name: 'Invite' }).click();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('testmember@yahoo.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByPlaceholder('Email')).toBeEmpty();

    const emailsMember = await request.get(routes.api.emails);
    const resMember = JSON.parse(await emailsMember.text());
    const lastEmailMember = resMember.slice(-1)[0];
    const redirectUrlMember = lastEmailMember.text;

    //go to member dashboard
    await page.goto(redirectUrlMember);
    await page.waitForURL(routes.segments.userDash);
    await expect(page.getByRole('main')).toContainText('Setting Up Organization Finished');
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await expect(page.getByRole('paragraph')).toContainText('Role: MEMBER');
    await page.getByRole('link', { name: 'OrgMemberTest Role: MEMBER Click Go' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('main')).toContainText('All Roles can See This');
    await expect(page.getByText('Only Owner can See This')).not.toBeVisible();
    await expect(page.getByText('Admin and Owner Roles can See This')).not.toBeVisible();
  });
});

test.describe('Permission Invite Tests', () => {
  test.afterAll(async ({ page }) => {
    await clearDB();
  });
  test.beforeAll(async ({ page, request }) => {
    await page.goto(routes.urls.base);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.waitForURL(routes.segments.login);
    await page.getByPlaceholder('Email').fill('userTestInvite@yahoo.com');
    await page.getByRole('button', { name: 'Login with Email' }).click();

    await page.waitForURL(routes.segments.authConfirm);
    await expect(page.getByRole('heading')).toContainText('Request Successfully Submitted');

    const emails = await request.get(routes.api.emails);
    const res = JSON.parse(await emails.text());
    const lastEmail = res.slice(-1)[0];
    const redirectUrl = lastEmail.text;

    await page.goto(redirectUrl);
    await page.waitForURL(routes.segments.userDash);

    //create org
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'Create Org' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('OrgInviteTest');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Title')).toBeEmpty();
    await page.getByRole('link', { name: 'My SAAS' }).click();

    //setup member role
    await page.goto(routes.urls.UserDashboard);
    await page.getByRole('link', { name: 'OrgInviteTest Role: OWNER Click Go' }).click();
    await page.waitForURL('**/dashboard/**');
    await expect(page.getByRole('link', { name: 'Invite' })).toBeVisible();
    await page.getByRole('link', { name: 'Invite' }).click();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('testinvitemember@yahoo.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByPlaceholder('Email')).toBeEmpty();

    const emailsInvite = await request.get(routes.api.emails);
    const resInvite = JSON.parse(await emailsInvite.text());
    const lastEmailInvite = resInvite.slice(-1)[0];
    const redirectUrlInvite = lastEmailInvite.text;

    await page.goto(redirectUrlInvite);
    await page.waitForURL(routes.segments.userDash);
    await expect(page.getByRole('main')).toContainText('Setting Up Organization Finished');
    await page.getByRole('link', { name: 'My SAAS' }).click();
    await expect(page.getByRole('paragraph')).toContainText('Role: MEMBER');
  });

  test('Remove User', async ({ page, request }) => {
    await page.goto(routes.urls.base);
    await page.getByRole('link', { name: 'Login' }).click();

    await page.waitForURL(routes.segments.login);
    await page.getByPlaceholder('Email').fill('userTestInvite@yahoo.com');
    await page.getByRole('button', { name: 'Login with Email' }).click();

    await page.waitForURL(routes.segments.authConfirm);
    await expect(page.getByRole('heading')).toContainText('Request Successfully Submitted');

    const emails = await request.get(routes.api.emails);
    const res = JSON.parse(await emails.text());
    const lastEmail = res.slice(-1)[0];
    const redirectUrl = lastEmail.text;

    await page.goto(redirectUrl);
    await page.waitForURL(routes.segments.userDash);

    await page.getByRole('link', { name: 'OrgInviteTest Role: OWNER Click Go' }).click();
    await page.waitForURL('**/dashboard/**');
    await expect(page.getByRole('link', { name: 'Invite' })).toBeVisible();
    await page.getByRole('link', { name: 'Invite' }).click();
    await expect(page.locator('tbody')).toContainText('testinvitemember@yahoo.com');
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.locator('tbody')).not.toContainText('testinvitemember@yahoo.com');
  });
});
