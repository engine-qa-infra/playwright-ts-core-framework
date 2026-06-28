import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

test.describe('SauceDemo - Login', () => {
  test('standard_user logs in and is redirected to inventory', async ({ page }) => {
    const login = new LoginPage(page);
    await login.openAndLogin('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('locked_out_user is blocked and shows exact red error banner', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // Do not wait for navigation — locked out users stay on the login page
    await login.login('locked_out_user', 'secret_sauce', { waitForNavigation: false });

    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });
});
