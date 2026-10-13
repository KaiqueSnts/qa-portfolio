import { Locator, Page } from '@playwright/test';

export const PRODUCTS = {
  backpack: { slug: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  bikeLight: { slug: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
  boltTShirt: { slug: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt' },
} as const;

export type Product = (typeof PRODUCTS)[keyof typeof PRODUCTS];

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(product: Product): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${product.slug}`).click();
  }

  async removeFromCart(product: Product): Promise<void> {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
