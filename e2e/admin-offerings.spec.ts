import { test, expect } from '@playwright/test';

test('admin offering management flow', async ({ page, isMobile }) => {
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

    // Navigate to Offerings
    if (isMobile) {
        await page.locator('header button').first().click();
        await page.waitForTimeout(500);
    }
    await page.getByTestId('sidebar-offerings').click();
    await expect(page.getByRole('heading', { name: 'All Offerings' })).toBeVisible();

    // Add New Offering
    await page.getByRole('button', { name: 'Add New Offering' }).click();
    await expect(page.getByRole('heading', { name: 'Record New Offering' })).toBeVisible();

    // Fill Form
    // We need a member to select. Assuming there is at least one member or we created one.
    // Ideally we should create one first, but for simplicity let's assume seed data or previous test run.
    // If no members, this might fail. But let's try to select the first option if available.

    // Wait for select to be populated (it fetches members)
    await page.waitForTimeout(1000);

    // Select Member
    await page.locator('#member').click(); // Click trigger
    // Select first item
    await page.locator('[role="option"]').first().click();

    await page.getByLabel('Amount (₹) *').fill('500');

    // Select Offer Type
    await page.locator('#offerType').click();
    await page.getByRole('option', { name: 'Tithe' }).click();

    // Select Payment Mode
    await page.locator('#paymentMode').click();
    await page.getByRole('option', { name: 'Cash' }).click();

    // Submit
    await page.getByRole('button', { name: 'Record Offering' }).click();

    // Verify Success
    await expect(page.getByRole('heading', { name: 'All Offerings' })).toBeVisible();

    // Verify Offering in List (might need to search or just check first row)
    // Since we just added it, it might be at the top or we search by amount
    await page.getByPlaceholder('Search by member, type, amount, or date...').fill('500');
    await expect(page.getByRole('cell', { name: '500' }).first()).toBeVisible();
});
