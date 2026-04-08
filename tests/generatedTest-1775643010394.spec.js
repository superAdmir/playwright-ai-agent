
const { test, expect } = require('@playwright/test');

test('AI Generated Test', async ({ page }) => {
  // Example generated from user story
  await page.goto('https://example.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#loginButton');
  await expect(page).toHaveURL('https://example.com/dashboard');
  await page.screenshot({ path: 'tmp/login-test-1775643010394.png' });
});
