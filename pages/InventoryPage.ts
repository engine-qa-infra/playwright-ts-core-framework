import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortSelect: Locator;
  readonly itemCards: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.locator('.product_sort_container');
    this.itemCards = page.locator('.inventory_item');
    this.productTitles = page.locator('.inventory_item_name');
  }

  async selectSortOptionByText(optionText: string): Promise<void> {
    await this.sortSelect.selectOption({ label: optionText });
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.itemCards.locator('.inventory_item_price');
    const priceCount = await priceLocators.count();
    const prices: number[] = [];

    for (let index = 0; index < priceCount; index += 1) {
      const text = await priceLocators.nth(index).textContent();
      if (!text) continue;
      const value = parseFloat(text.replace(/[^0-9.]+/g, ''));
      if (!Number.isNaN(value)) prices.push(value);
    }

    return prices;
  }

  async getProductTitles(): Promise<string[]> {
    const titleCount = await this.productTitles.count();
    const titles: string[] = [];

    for (let index = 0; index < titleCount; index += 1) {
      const text = await this.productTitles.nth(index).textContent();
      if (text) titles.push(text.trim());
    }

    return titles;
  }
  async addItemToCartByIndex(index: number = 0): Promise<void> {
  // Finds the "Add to cart" button inside a specific item card
  await this.itemCards.nth(index).locator('button:has-text("Add to cart")').click();
  }
}

export default InventoryPage;
