import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Mock the backend API response to avoid ECONNREFUSED errors
    await page.route('**/api/health', async route => {
        const json = { status: 'healthy', message: 'Mocked Backend is healthy' };
        await route.fulfill({ json });
    });
});

test('should display application title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ShopSmart/);
});

test('should display backend status from mocked API', async ({ page }) => {
    await page.goto('/');

    // Check if the main container is present
    await expect(page.locator('h1')).toContainText('ShopSmart');

    // Checking for "Backend Status" card and the mocked response
    await expect(page.locator('.card h2')).toContainText('Backend Status');
    await expect(page.getByText('Mocked Backend is healthy')).toBeVisible();
});
