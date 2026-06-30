import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

test.describe('Checkout flow', () => {
  test('standard_user completes checkout and verifies subtotal, tax, and total', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.openAndLogin('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    const firstItem = page.locator('.inventory_item').nth(0);
    const secondItem = page.locator('.inventory_item').nth(1);
    const firstPrice = parseFloat((await firstItem.locator('.inventory_item_price').textContent())?.trim().replace('$', '') ?? '0');
    const secondPrice = parseFloat((await secondItem.locator('.inventory_item_price').textContent())?.trim().replace('$', '') ?? '0');

    await firstItem.locator('.btn_inventory').click();
    await secondItem.locator('.btn_inventory').click();

    await expect(await cartPage.getCartBadgeCount()).toBe('2');

    await cartPage.cartBadgeLink.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.cartItems).toHaveCount(2);

    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    await checkoutPage.fillCheckoutInformation('Jane', 'Doe', '90210');
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    const subtotal = await checkoutPage.getSubtotalAmount();
    const tax = await checkoutPage.getTaxAmount();
    const total = await checkoutPage.getTotalAmount();
    const expectedSubtotal = parseFloat((firstPrice + secondPrice).toFixed(2));

    await expect(subtotal).toBe(expectedSubtotal);
    await expect(tax).toBeGreaterThanOrEqual(0);
    await expect(subtotal + tax).toBe(total);
  });
});
