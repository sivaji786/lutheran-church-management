import { test, expect } from '@playwright/test';

const pages = [
    { path: '/about', heading: 'About Us' },
    { path: '/ministries', heading: 'Our Ministries' },
    { path: '/events', heading: 'Church Events' },
    { path: '/sermons', heading: 'Sermons' },
    { path: '/photos', heading: 'Photo Gallery' },
    { path: '/videos', heading: 'Video Gallery' },
    { path: '/contact', heading: 'Contact Us' },
    { path: '/im-new', heading: "I'm New" },
    { path: '/sunday-school', heading: 'Sunday School' },
    { path: '/youth', heading: 'Youtheran' },
    { path: '/women', heading: 'Women\'s Samaj' },
    { path: '/aelc', heading: 'Andhra Evangelical Lutheran Church' },
    { path: '/lch', heading: 'Lutheran Church Hyderabad' },
];

test.describe('Public Pages Navigation', () => {
    for (const { path, heading } of pages) {
        test(`should load ${path} page`, async ({ page, isMobile }) => {
            await page.goto(path);

            // Check for the main heading
            // Check for the main heading
            // Using getByRole heading with name might be strict, so we can use getByText or be specific
            // Some pages might have different heading levels or structures, but usually h1 or h2
            // Wait for load state
            // await page.waitForLoadState('networkidle'); // Causing timeouts


            // Relaxing to getByRole('heading', { name: /heading/i }) to be case insensitive
            // For "I'm New", the heading is split into "i am" and "New"
            if (path === '/im-new') {
                // Check for "New" text which is the main visual heading
                await expect(page.locator('h1', { hasText: 'New' }).first()).toBeVisible();
            } else if (['/women', '/aelc', '/youth', '/sunday-school'].includes(path)) {
                // Use exact text matching for these to avoid regex issues with special chars or length
                // Note: Sunday School page has "Sunday Schools"
                const expectedHeading = path === '/sunday-school' ? 'Sunday Schools' : heading;
                await expect(page.locator('h1', { hasText: expectedHeading }).first()).toBeVisible();
            } else if (path === '/lch') {
                // The page heading is "LC Hyderabad"
                await expect(page.locator('h1', { hasText: 'LC Hyderabad' }).first()).toBeVisible();
            } else {
                // Use locator('h1') which is very specific and robust for these pages
                await expect(page.locator('h1', { hasText: new RegExp(heading, 'i') }).first()).toBeVisible();
            }

            // Check for Header and Footer presence to ensure layout is loaded
            // Header might be collapsed on mobile, but the container should exist
            // We can check for a common element like the Logo or Menu button
            if (isMobile) {
                await expect(page.locator('header')).toBeVisible();
            } else {
                await expect(page.getByRole('navigation')).toBeVisible();
            }

            // Fix strict mode violation for footer
            await expect(page.locator('footer').first()).toBeVisible();
        });
    }
});
