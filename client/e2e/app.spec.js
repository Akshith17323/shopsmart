import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Mock the backend API response for products
    await page.route('**/api/products', async route => {
        const json = [
            { id: 999, name: 'Mocked Test Product', description: 'A product from our tests', price: 99.99, image: 'https://placehold.co/100x100?text=Mock' }
        ];
        await route.fulfill({ json });
    });
});

test('should display application title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ShopSmart/);
});

test('should display product grid and handle cart logic', async ({ page }) => {
    await page.goto('/');

    // Check if the main logo is present
    await expect(page.locator('h1.logo')).toContainText('ShopSmart');

    // Wait for mock data to load
    await expect(page.locator('.products-grid')).toBeVisible();
    await expect(page.getByText('Mocked Test Product')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();

    // Check cart functionality
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // The cart should open and show the item
    await expect(page.locator('.cart-sidebar')).toHaveClass(/open/);
    await expect(page.locator('.cart-item-title')).toContainText('Mocked Test Product');
    
    // Check total
    await expect(page.locator('.cart-total')).toContainText('$99.99');
});
