
import { expect, test } from '@playwright/test';
import { AUTH_FILE } from '../../fixtures/env';
import { CartPage } from '../../pages/CartPage';
import { InventoryPage, PRODUCTS } from '../../pages/InventoryPage';

test.use({ storageState: AUTH_FILE });

test.describe('Carrinho', () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    await inventory.goto();
  });

  test('adicionar item atualiza o contador e aparece no carrinho', { tag: ['@smoke', '@regression'] }, async () => {
    await inventory.addToCart(PRODUCTS.backpack);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemNames).toHaveText(PRODUCTS.backpack.name);
  });

  test('adicionar dois itens mostra contador 2', { tag: ['@regression'] }, async () => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.addToCart(PRODUCTS.bikeLight);

    await expect(inventory.cartBadge).toHaveText('2');
  });

  test('remover item no catálogo zera o contador', { tag: ['@regression'] }, async () => {
    await inventory.addToCart(PRODUCTS.boltTShirt);
    await inventory.removeFromCart(PRODUCTS.boltTShirt);

    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('remover item dentro do carrinho esvazia a lista', { tag: ['@regression'] }, async () => {
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();
    await expect(cart.items).toHaveCount(1);
    await cart.removeItem(PRODUCTS.backpack);

    await expect(cart.items).toHaveCount(0);
  });
});
