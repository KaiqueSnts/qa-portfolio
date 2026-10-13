import { Locator, Page } from '@playwright/test';
import { Product } from './InventoryPage';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(product: Product): Promise<void> {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
