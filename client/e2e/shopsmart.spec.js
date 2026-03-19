import { test, expect } from '@playwright/test';

test.describe('ShopSmart Full Core Application Flow', () => {
    
    test.beforeEach(async ({ page }) => {
        // Mock the backend API so E2E tests are perfectly deterministic locally and inside GitHub Actions CI
        await page.route('**/api/products', async route => {
            const mockData = [
                { id: 1, name: 'Premium Backpack', description: 'Waterproof gear', price: 129.99, image: 'mock.jpg' },
                { id: 2, name: 'Wireless Headset', description: 'Noise cancelling', price: 199.99, image: 'mock.jpg' }
            ];
            await route.fulfill({ json: mockData });
        });
        
        // Instruct headless browser to navigate to Vite local dev server
        await page.goto('http://localhost:5173');
    });

    test('should universally load the new structural UI components', async ({ page }) => {
        // Verify NavBar is present and styled
        await expect(page.locator('.navbar')).toBeVisible();
        await expect(page.locator('h1.logo').first()).toHaveText('ShopSmart');
        
        // Verify Footer is correctly placed dynamically at the bottom
        await expect(page.locator('.footer')).toBeVisible();
        await expect(page.locator('.footer-bottom')).toContainText('© 2026 ShopSmart');
    });

    test('should authenticate via the interactive mocked login flow', async ({ page }) => {
        const loginBtn = page.locator('.login-button');
        await expect(loginBtn).toBeVisible();
        await loginBtn.click();
        
        // Verify the login button swapped to logout state instantly
        await expect(page.locator('.logout-button')).toBeVisible();
    });

    test('should intercept the network payload and inject into the Glassmorphic grid', async ({ page }) => {
        const grid = page.locator('.products-grid');
        await expect(grid).toBeVisible();
        
        // Verify the 2 JSON Mock Products successfully drew standard DOM elements
        const cards = page.locator('.product-card');
        await expect(cards).toHaveCount(2);
        
        // Deep verification of rendered states
        await expect(cards.nth(0)).toContainText('Premium Backpack');
        await expect(cards.nth(0)).toContainText('$129.99');
        await expect(cards.nth(1)).toContainText('Wireless Headset');
    });

    test('should strictly manage localized Cart state arrays upon product selection', async ({ page }) => {
        const firstProductAddBtn = page.locator('.product-card').first().locator('.add-button');
        await firstProductAddBtn.click(); // Inject the first item into global React state
        
        const sidebar = page.locator('.cart-sidebar');
        await expect(sidebar).toBeVisible();
        
        // Verify the header React Cart Badge accurately displays an array length of 1
        await expect(page.locator('.cart-badge')).toHaveText('1');
        
        const cartItems = page.locator('.cart-item');
        await expect(cartItems).toHaveCount(1);
        await expect(cartItems.first()).toContainText('Premium Backpack');
        
        // Ensure Checkout capability enables securely once items are loaded
        const checkoutBtn = page.locator('.checkout-button');
        await expect(checkoutBtn).toBeVisible();
    });
});
