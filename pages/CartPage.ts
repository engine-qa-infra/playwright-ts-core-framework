import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartBadgeLink: Locator;
  readonly cartItems: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadgeLink = page.locator('.shopping_cart_link');
    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('.cart_button');
  }

  /**
   * Get the visible item count string from the cart badge in the page header.
   */
  async getCartBadgeCount(): Promise<string> {
    const badgeText = await this.cartBadgeLink.textContent();
    return badgeText?.trim() ?? '';
  }

  /**
   * Remove a specific item from the cart by its visible product name.
   * @param itemName - exact visible title of the cart item
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    const targetItem = this.cartItems.filter({ has: this.page.locator('.inventory_item_name', { hasText: itemName }) }).first();

    if (await targetItem.count() === 0) {
      throw new Error(`Cart item not found: ${itemName}`);
    }

    const removeButton = targetItem.locator('.cart_button');
    await removeButton.click();
  }
}

export default CartPage;
