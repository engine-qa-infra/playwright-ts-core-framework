import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';

test.describe('Shopping cart flow', () => {
  test('standard_user adds first inventory item and sees it in the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openAndLogin('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const firstAddButton = page.locator('.inventory_item .btn_inventory').first();
    const firstItemName = page.locator('.inventory_item_name').first();

    await expect(firstAddButton).toBeVisible();
    await expect(firstItemName).toBeVisible();

    const productName = await firstItemName.textContent();
    await firstAddButton.click();

    await expect(await cartPage.getCartBadgeCount()).toBe('1');

    await cartPage.cartBadgeLink.click();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.locator('.inventory_item_name')).toContainText(productName?.trim() ?? '');
  });
});
