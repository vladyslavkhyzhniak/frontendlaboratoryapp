const { test, expect } = require('@playwright/test');

test('niezalogowany użytkownik powinien zostać przekierowany do logowania przy próbie wejścia na profil', async ({ page }) => {

  await page.goto('http://localhost:3000/user/profile');
  await expect(page).toHaveURL(/.*\/user\/signin\?returnUrl=.*profile/);
  await expect(page.getByRole('heading', { name: 'Zaloguj się' })).toBeVisible();
});