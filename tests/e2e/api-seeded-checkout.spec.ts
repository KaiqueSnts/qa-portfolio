
import { expect, test } from '../../fixtures';
import { buildBooking } from '../../fixtures/bookingData';
import { AUTH_FILE } from '../../fixtures/env';
import { Booking, CreatedBooking } from '../../clients/bookingClient';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { InventoryPage, PRODUCTS } from '../../pages/InventoryPage';

test.use({ storageState: AUTH_FILE });

test.describe('E2E: API + UI', () => {
  let createdId: number | undefined;

  test.afterEach(async ({ bookingClient }) => {
    if (createdId !== undefined) {
      const token = await bookingClient.createToken();
      await bookingClient.deleteBooking(createdId, token);
      createdId = undefined;
    }
  });

  test('checkout usando dados de cliente criados via API', { tag: ['@regression'] }, async ({ page, bookingClient }) => {

    const payload = buildBooking();
    const createResponse = await bookingClient.createBooking(payload);
    expect(createResponse.status()).toBe(200);

    const created = (await createResponse.json()) as CreatedBooking;
    createdId = created.bookingid;

    const getResponse = await bookingClient.getBooking(createdId);
    const customer = (await getResponse.json()) as Booking;
    expect(customer.firstname).toBe(payload.firstname);


    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.goto();
    await inventory.addToCart(PRODUCTS.bikeLight);
    await inventory.openCart();
    await new CartPage(page).checkout();

    await checkout.fillInformation({
      firstName: customer.firstname,
      lastName: customer.lastname,
      postalCode: '72910-000',
    });
    await checkout.continue();
    await checkout.finish();

    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });
});
