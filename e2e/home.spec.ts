import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Lutheran Church/);
});

test('navigation menu works', async ({ page, isMobile }) => {
    await page.goto('/');

    // Check if navigation links are present in the header
    await expect(page.locator('header').getByRole('button', { name: 'Home' })).toBeVisible();

    if (!isMobile) {
        // On desktop, check for Login button in header
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    }
});
