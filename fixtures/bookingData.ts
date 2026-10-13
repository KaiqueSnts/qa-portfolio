import { Booking } from '../clients/bookingClient';

function isoDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

function uniqueSuffix(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Gera uma reserva com dados únicos a cada chamada (massa dinâmica). */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = uniqueSuffix();
  return {
    firstname: `Qa${suffix}`,
    lastname: `Tester${suffix}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: isoDate(7), checkout: isoDate(10) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
