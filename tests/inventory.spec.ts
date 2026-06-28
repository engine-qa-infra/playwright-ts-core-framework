import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

const sortCases = [
  {
    label: 'Price (low to high)',
    scraper: async (page: InventoryPage) => page.getProductPrices(),
    expected: (items: number[]) => [...items].sort((a, b) => a - b),
  },
  {
    label: 'Price (high to low)',
    scraper: async (page: InventoryPage) => page.getProductPrices(),
    expected: (items: number[]) => [...items].sort((a, b) => b - a),
  },
  {
    label: 'Name (A to Z)',
    scraper: async (page: InventoryPage) => page.getProductTitles(),
    expected: (items: string[]) => [...items].sort((a, b) => a.localeCompare(b)),
  },
  {
    label: 'Name (Z to A)',
    scraper: async (page: InventoryPage) => page.getProductTitles(),
    expected: (items: string[]) => [...items].sort((a, b) => b.localeCompare(a)),
  },
];

test.describe('Inventory sorting validation', () => {
  for (const testCase of sortCases) {
    test(`${testCase.label} returns the expected order`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.openAndLogin('standard_user', 'secret_sauce');

      const inventoryPage = new InventoryPage(page);
      await inventoryPage.selectSortOptionByText(testCase.label);

      const actual = await testCase.scraper(inventoryPage);
      const expected = testCase.expected(actual as any);

      await expect(actual).toEqual(expected);
    });
  }
});
