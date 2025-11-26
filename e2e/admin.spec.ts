import { test, expect } from '@playwright/test';

test('admin login flow and dashboard navigation', async ({ page, isMobile }) => {
    await page.goto('/');

    // Navigate to Login page
    if (isMobile) {
        await page.getByRole('button').filter({ has: page.locator('svg.lucide-menu') }).click();
        await page.waitForTimeout(500);
    }
    await page.getByRole('button', { name: 'Login' }).click();

    // Switch to Admin tab
    await page.getByTestId('tab-trigger-admin').click();

    // Fill in Admin credentials
    await page.getByTestId('admin-username-input').fill('admin');
    await page.getByTestId('admin-password-input').fill('admin123');

    // Click Sign In
    await page.getByTestId('admin-login-button').click();

    // Verify Admin Dashboard load
    // Check for "Welcome Back, Admin" heading
    await expect(page.getByRole('heading', { name: 'Welcome Back, Admin' })).toBeVisible();

    // Check for Sidebar elements (desktop) or Menu button (mobile)
    if (!isMobile) {
        await expect(page.getByTestId('sidebar-dashboard')).toBeVisible();
        await expect(page.getByTestId('sidebar-members')).toBeVisible();
        await expect(page.getByTestId('sidebar-offerings')).toBeVisible();
        await expect(page.getByTestId('sidebar-tickets')).toBeVisible();
    }

    // Check for Stats Cards
    await expect(page.getByText('Total Members')).toBeVisible();
    await expect(page.getByText('Total Offerings')).toBeVisible();
    await expect(page.getByText('This Month')).toBeVisible();
    await expect(page.getByText('Open Tickets')).toBeVisible();

    // Test Navigation to Members
    if (isMobile) {
        // Open sidebar on mobile
        await page.locator('header button').first().click(); // Assuming first button is menu toggle in admin header
        await page.waitForTimeout(500);
    }
    await page.getByTestId('sidebar-members').click();

    // Verify Members page loaded
    await expect(page.getByRole('heading', { name: 'All Members' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add New Member' })).toBeVisible();

    // Test Navigation to Offerings
    if (isMobile) {
        await page.locator('header button').first().click();
        await page.waitForTimeout(500);
    }
    await page.getByTestId('sidebar-offerings').click();

    // Verify Offerings page loaded
    await expect(page.getByRole('heading', { name: 'All Offerings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add New Offering' })).toBeVisible();
});
