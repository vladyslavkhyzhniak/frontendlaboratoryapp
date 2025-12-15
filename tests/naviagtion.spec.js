const { test, expect } = require('@playwright/test');

test('has link do login page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.click("text=Sign In");

  await expect(page).toHaveURL('http://localhost:3000/user/signin');

await expect(page.getByRole('heading', { name: 'Zaloguj się' })).toBeVisible();
});