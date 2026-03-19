import { test, expect } from '@playwright/test';

test('Simulate real user flow: Login -> Action -> Logout', async ({ page }) => {
  // Navigate to standard Dev server address locally via Playwright
  await page.goto('http://localhost:5173');
  
  // 1. Simulate Login Flow
  const loginButton = page.locator('.login-button');
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  
  // 2. Verify Successful Action result via State Change
  const logoutButton = page.locator('.logout-button');
  await expect(logoutButton).toBeVisible();
  await expect(loginButton).not.toBeVisible();
  
  // 3. Simulate Logout Flow
  await logoutButton.click();
  await expect(loginButton).toBeVisible();
});
