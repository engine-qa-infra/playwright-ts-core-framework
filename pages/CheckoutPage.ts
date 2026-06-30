import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly itemSubtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalPriceLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('[data-test="continue"]');
    this.itemSubtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalPriceLabel = page.locator('.summary_total_label');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  private parsePrice(labelText: string): number {
    const match = labelText.match(/\d+\.\d{2}/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getSubtotalAmount(): Promise<number> {
    return this.parsePrice((await this.itemSubtotalLabel.textContent()) ?? '0.00');
  }

  async getTaxAmount(): Promise<number> {
    return this.parsePrice((await this.taxLabel.textContent()) ?? '0.00');
  }

  async getTotalAmount(): Promise<number> {
    return this.parsePrice((await this.totalPriceLabel.textContent()) ?? '0.00');
  }
}

export default CheckoutPage;
