import { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../fixtures/env';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

/**
 * Camada de serviço para a API restful-booker.
 * Os métodos devolvem o APIResponse para que os testes decidam o que validar.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  authenticate(
    username: string = env.apiUsername,
    password: string = env.apiPassword,
  ): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /** Atalho que devolve o token ou falha com mensagem clara. */
  async createToken(): Promise<string> {
    const response = await this.authenticate();
    const body = (await response.json()) as { token?: string; reason?: string };
    if (!body.token) {
      throw new Error(`Falha ao autenticar: ${body.reason ?? response.status()}`);
    }
    return body.token;
  }

  getBookingIds(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  updateBooking(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }
}
