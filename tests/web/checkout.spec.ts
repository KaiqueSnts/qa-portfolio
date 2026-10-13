
import { expect, test } from '@playwright/test';
import { AUTH_FILE } from '../../fixtures/env';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInfo, CheckoutPage } from '../../pages/CheckoutPage';
import { InventoryPage, PRODUCTS } from '../../pages/InventoryPage';

test.use({ storageState: AUTH_FILE });

const validInfo: CheckoutInfo = {
  firstName: 'Maria',
  lastName: 'Silva',
  postalCode: '72910-000',
};

test.describe('Checkout', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const inventory = new InventoryPage(page);
    checkout = new CheckoutPage(page);

    await inventory.goto();
    await inventory.addToCart(PRODUCTS.backpack);
    await inventory.openCart();
    await new CartPage(page).checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('compra completa exibe confirmação do pedido', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    await checkout.fillInformation(validInfo);
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkout.finish();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  const requiredFieldCases: { missing: keyof CheckoutInfo; message: string }[] = [
    { missing: 'firstName', message: 'First Name is required' },
    { missing: 'lastName', message: 'Last Name is required' },
    { missing: 'postalCode', message: 'Postal Code is required' },
  ];

  for (const { missing, message } of requiredFieldCases) {
    test(`campo obrigatório ausente: ${missing}`, { tag: ['@regression'] }, async () => {
      await checkout.fillInformation({ ...validInfo, [missing]: '' });
      await checkout.continue();

      await expect(checkout.errorMessage).toContainText(message);
    });
  }
});
