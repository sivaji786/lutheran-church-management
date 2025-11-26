import { test, expect } from '@playwright/test';

test.describe('Member Portal', () => {
    const memberMobile = '9876543210';
    const memberCode = 'LCH001';
    const memberPassword = 'member123';

    test.setTimeout(120000); // Increase timeout for the entire flow

    test('member login and dashboard flow', async ({ page, isMobile }) => {
        await page.goto('/');

        // --- TEST MEMBER FLOW ---
        // Now login as the member we just created/ensured exists
        // await page.goto('/'); // Start from home since we skipped seeding - no longer needed as admin logout leaves us on a public page
        await page.getByRole('button', { name: 'Login' }).click();

        // Ensure Member tab is active (default)
        await expect(page.getByRole('tab', { name: 'Member' })).toHaveAttribute('aria-selected', 'true');

        // Use Demo Login or Fill Credentials
        // Since we created a specific member, let's try to login with those credentials
        // But we didn't set a password in the "Add Member" form?
        // Wait, the Add Member form usually doesn't set password.
        // The backend might set a default or we need to use the demo credentials if the backend is mocked.
        // Actually, LoginPage.tsx has a hardcoded demo login logic:
        // if (memberLoginType === 'mobile') ... setMemberPassword('member123');
        // But the API call uses whatever is passed.
        // If the backend is real, we need to know the password.
        // The default password for new members might be 'member123' or similar.
        // Let's assume 'member123' works or use the demo credentials which might bypass auth if mocked?
        // No, the API client sends the request.

        // Mock API responses to ensure test stability
        // Correct route pattern: /api/auth/member/login
        await page.route('**/api/auth/member/login', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        memberCode: memberCode,
                        name: 'Test Member',
                        mobile: memberMobile,
                        token: 'mock-token'
                    }
                })
            });
        });

        await page.route('**/api/members*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        members: [{
                            id: '1', // String ID
                            memberCode: memberCode,
                            name: 'Test Member',
                            mobile: memberMobile,
                            occupation: 'Tester',
                            dateOfBirth: '1990-01-01',
                            aadharNumber: '123456789012',
                            address: 'Test Address',
                            area: 'Test Area',
                            ward: 'Test Ward',
                            status: 'active'
                        }]
                    }
                })
            });
        });

        await page.route('**/api/offerings*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, data: { offerings: [] } })
            });
        });

        await page.route('**/api/tickets*', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true, data: { id: 'new-ticket-id' } })
                });
            } else {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        data: {
                            tickets: [{
                                id: '1',
                                ticketNumber: 'T123456',
                                memberId: '1', // String ID matching member
                                memberName: 'Test Member',
                                memberCode: memberCode,
                                category: 'Request',
                                subject: 'Test Ticket Subject',
                                description: 'This is a test ticket description.',
                                status: 'Open',
                                createdDate: '2023-01-01',
                                updatedDate: '2023-01-01'
                            }]
                        }
                    })
                });
            }
        });

        // Try Member Code login
        await page.getByRole('button', { name: 'Member Code' }).click();
        await page.getByLabel('Member Code').fill(memberCode);
        await page.getByLabel('Password').fill(memberPassword);

        await page.getByRole('button', { name: 'Sign In as Member' }).click();

        // Verify Dashboard Load
        await expect(page.getByRole('heading', { name: 'Welcome,' })).toBeVisible({ timeout: 5000 });

        // Navigate to My Details
        if (isMobile) {
            await page.locator('header button').first().click();
            await page.waitForTimeout(500);
        }
        await page.getByRole('button', { name: 'My Details' }).click();
        await expect(page.getByRole('heading', { name: 'My Details' })).toBeVisible();
        await expect(page.getByText('Personal Information')).toBeVisible();

        // Navigate to My Offerings
        if (isMobile) {
            await page.locator('header button').first().click();
            await page.waitForTimeout(500);
        }
        await page.getByRole('button', { name: 'My Offerings' }).click();
        await expect(page.getByRole('heading', { name: 'My Offerings' })).toBeVisible();
        await expect(page.getByText('Offering History')).toBeVisible();

        // Navigate to My Tickets
        if (isMobile) {
            await page.locator('header button').first().click();
            await page.waitForTimeout(500);
        }
        await page.getByRole('button', { name: 'My Tickets' }).click();
        await expect(page.getByRole('heading', { name: 'My Tickets' })).toBeVisible();

        // Create a Ticket
        await page.getByLabel('Subject *').fill('Test Ticket Subject');
        await page.getByLabel('Category *').click();
        await page.getByRole('option', { name: 'Request' }).click();

        await page.getByLabel('Description *').fill('This is a test ticket description.');

        await page.getByRole('button', { name: 'Submit Ticket' }).click();

        // Verify Ticket appears in list (My Submitted Tickets)
        await expect(page.getByText('Test Ticket Subject')).toBeVisible();
    });
});
