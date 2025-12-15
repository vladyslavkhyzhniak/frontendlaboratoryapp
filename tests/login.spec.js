const { test, expect } = require('@playwright/test');

test('powinien zalogować użytkownika i przekierować do profilu', async ({ page }) => {

  await page.goto('http://localhost:3000/user/profile');
  await page.getByLabel('Adres email').fill('vladyslavkhyzhniak@gmail.com');
  await page.getByLabel('Hasło').fill('123123');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page).toHaveURL('http://localhost:3000/user/profile');
  await expect(page.getByRole('heading', { name: 'Profil użytkownika' })).toBeVisible();
});