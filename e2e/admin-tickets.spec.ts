import { test, expect } from '@playwright/test';

test('admin ticket management flow', async ({ page, isMobile }) => {
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

    // Navigate to Tickets
    if (isMobile) {
        await page.locator('header button').first().click();
        await page.waitForTimeout(500);
    }
    await page.getByTestId('sidebar-tickets').click();
    await expect(page.getByRole('heading', { name: 'All Tickets' })).toBeVisible();

    // Verify Table Headers or Empty State
    const emptyState = page.getByText('No tickets found');
    const tableHeader = page.getByRole('columnheader', { name: 'Ticket #' });

    if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
    } else {
        await expect(tableHeader).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Subject' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();

        // Filter Tickets (Test UI interaction only if table is visible)
        // Open Status Filter
        await page.locator('#filter-status').click();
        await page.getByRole('option', { name: 'Open' }).click();

        // Verify filter badge or URL param if applicable (here it's local state)
        // Just checking if UI didn't crash and table is still visible
        await expect(page.locator('table')).toBeVisible();

        // Clear Filters
        await page.getByRole('button', { name: 'Clear Filters' }).click();
    }
});
