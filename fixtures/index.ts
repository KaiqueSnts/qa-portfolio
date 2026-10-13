import { test as base, expect } from '@playwright/test';
import { Booking, BookingClient, CreatedBooking } from '../clients/bookingClient';
import { buildBooking } from './bookingData';
import { env } from './env';

type Fixtures = {
  /** Cliente da API já configurado com baseURL e headers JSON. */
  bookingClient: BookingClient;
  /** Token de autenticação válido. */
  authToken: string;
  /** Reserva criada antes do teste e removida automaticamente depois. */
  createdBooking: { id: number; payload: Booking };
};

export const test = base.extend<Fixtures>({
  bookingClient: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.apiUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    await use(new BookingClient(context));
    await context.dispose();
  },

  authToken: async ({ bookingClient }, use) => {
    await use(await bookingClient.createToken());
  },

  createdBooking: async ({ bookingClient, authToken }, use) => {
    const payload = buildBooking();
    const response = await bookingClient.createBooking(payload);
    expect(response.status(), 'setup: criação da reserva').toBe(200);
    const body = (await response.json()) as CreatedBooking;

    await use({ id: body.bookingid, payload });

    // Cleanup: se o teste já removeu a reserva, o retorno é 405 e pode ser ignorado.
    await bookingClient.deleteBooking(body.bookingid, authToken);
  },
});

export { expect };
