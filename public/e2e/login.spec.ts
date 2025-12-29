import { test, expect } from '@playwright/test';

test('login flow', async ({ page, isMobile }) => {
    await page.goto('/');

    // Navigate to Login page
    if (isMobile) {
        await page.getByRole('button').filter({ has: page.locator('svg.lucide-menu') }).click();
    }
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify Login Page content
    await expect(page.getByRole('heading', { name: 'Member Portal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel('Mobile Number')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In as Member' })).toBeVisible();

    // Attempt a login with invalid credentials
    await page.getByLabel('Mobile Number').fill('0000000000');
    await page.getByLabel('Password').fill('invalid');

    // Click sign in
    await page.getByRole('button', { name: 'Sign In as Member' }).click();

    // Wait a bit for any response
    await page.waitForTimeout(2000);

    // Check if we are still on the login page (which means login failed, as expected)
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});
