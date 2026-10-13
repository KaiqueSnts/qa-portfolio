
import { buildBooking } from '../../fixtures/bookingData';
import { expect, test } from '../../fixtures';
import { Booking, CreatedBooking } from '../../clients/bookingClient';

test.describe('Restful-booker: reservas', () => {
  test('cria uma reserva e devolve os dados enviados', { tag: ['@smoke', '@regression'] }, async ({ bookingClient, authToken }) => {
    const payload = buildBooking();

    const response = await bookingClient.createBooking(payload);
    expect(response.status()).toBe(200);

    const body = (await response.json()) as CreatedBooking;
    try {
      expect(body.bookingid).toEqual(expect.any(Number));
      expect(body.booking).toEqual(payload);
    } finally {
      await bookingClient.deleteBooking(body.bookingid, authToken);
    }
  });

  test('busca reserva por id', { tag: ['@regression'] }, async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.getBooking(createdBooking.id);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(createdBooking.payload);
  });

  test('lista reservas filtrando por nome', { tag: ['@regression'] }, async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.getBookingIds({
      firstname: createdBooking.payload.firstname,
    });

    expect(response.status()).toBe(200);
    const ids = (await response.json()) as { bookingid: number }[];
    expect(ids.map((item) => item.bookingid)).toContain(createdBooking.id);
  });

  test('atualiza reserva com token válido', { tag: ['@regression'] }, async ({ bookingClient, createdBooking, authToken }) => {
    const updated = buildBooking({ firstname: 'Atualizado', totalprice: 999 });

    const response = await bookingClient.updateBooking(createdBooking.id, updated, authToken);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Booking;
    expect(body.firstname).toBe('Atualizado');
    expect(body.totalprice).toBe(999);
  });

  test('remove reserva e confirma 404 em seguida', { tag: ['@smoke', '@regression'] }, async ({ bookingClient, createdBooking, authToken }) => {
    const deleted = await bookingClient.deleteBooking(createdBooking.id, authToken);

    expect(deleted.status()).toBe(201);

    const afterDelete = await bookingClient.getBooking(createdBooking.id);
    expect(afterDelete.status()).toBe(404);
  });

  test('atualizar sem token retorna 403', { tag: ['@regression'] }, async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.updateBooking(createdBooking.id, buildBooking());

    expect(response.status()).toBe(403);
  });

  test('remover sem token retorna 403', { tag: ['@regression'] }, async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.deleteBooking(createdBooking.id);

    expect(response.status()).toBe(403);
  });

  test('buscar id inexistente retorna 404', { tag: ['@regression'] }, async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(999_999_999);

    expect(response.status()).toBe(404);
  });

  test('resposta respeita o contrato de tipos', { tag: ['@regression'] }, async ({ bookingClient, createdBooking }) => {
    const response = await bookingClient.getBooking(createdBooking.id);
    const body = await response.json();

    expect(body).toMatchObject({
      firstname: expect.any(String),
      lastname: expect.any(String),
      totalprice: expect.any(Number),
      depositpaid: expect.any(Boolean),
      bookingdates: {
        checkin: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        checkout: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      },
    });
  });
});

test.describe('Restful-booker: autenticação', () => {
  test('credenciais válidas devolvem token', { tag: ['@smoke', '@regression'] }, async ({ bookingClient }) => {
    const response = await bookingClient.authenticate();

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ token: expect.any(String) });
  });

  test('credenciais inválidas não devolvem token', { tag: ['@regression'] }, async ({ bookingClient }) => {
    const response = await bookingClient.authenticate('admin', 'senha_errada');


    const body = (await response.json()) as { token?: string; reason?: string };
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
