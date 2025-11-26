import { test, expect } from '@playwright/test';

test('admin member management flow', async ({ page, isMobile }) => {
    // Login as Admin
    await page.goto('/');
    if (isMobile) {
        await page.getByRole('button').filter({ has: page.locator('svg.lucide-menu') }).click();
        await page.waitForTimeout(500);
    }
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByTestId('tab-trigger-admin').click();
    await page.getByTestId('admin-username-input').fill('admin');
    await page.getByTestId('admin-password-input').fill('admin123');
    await page.getByTestId('admin-login-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome Back, Admin' })).toBeVisible();

    // Navigate to Members
    if (isMobile) {
        await page.locator('header button').first().click();
        await page.waitForTimeout(500);
    }
    await page.getByTestId('sidebar-members').click();
    await expect(page.getByRole('heading', { name: 'All Members' })).toBeVisible();

    // Add New Member
    await page.getByRole('button', { name: 'Add New Member' }).click();
    await expect(page.getByRole('heading', { name: 'Register New Member' })).toBeVisible();

    // Fill Form
    const timestamp = Date.now();
    const testName = `Test Member ${timestamp}`;
    await page.getByLabel('Full Name *').fill(testName);
    await page.getByLabel('Occupation *').fill('Software Engineer');
    await page.getByLabel('Date of Birth *').fill('1990-01-01');
    await page.getByLabel('Mobile Number *').fill('9876543210');
    await page.getByLabel('Aadhar Number *').fill('123456789012');
    await page.getByLabel('Address *').fill('123 Test St');
    await page.getByLabel('Area *').fill('Test Area');
    await page.getByLabel('Ward *').fill('1');

    // Submit
    await page.getByRole('button', { name: 'Register Member' }).click();

    // Verify Success (Toast or Redirection)
    // Check if redirected back to list
    await expect(page.getByRole('heading', { name: 'All Members' })).toBeVisible();

    // Verify Member in List
    await page.getByPlaceholder('Search by name, member code, mobile, occupation, or Aadhar...').fill(testName);
    await expect(page.getByRole('cell', { name: testName })).toBeVisible();
});
