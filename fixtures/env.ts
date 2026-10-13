import path from 'path';

/** URLs e credenciais vêm de variáveis de ambiente, com padrão para os alvos públicos. */
export const env = {
  webUrl: process.env.WEB_URL ?? 'https://www.saucedemo.com',
  apiUrl: process.env.API_URL ?? 'https://restful-booker.herokuapp.com',
  apiUsername: process.env.API_USERNAME ?? 'admin',
  apiPassword: process.env.API_PASSWORD ?? 'password123',
};

/** Arquivo onde a sessão autenticada da UI é salva pelo projeto "setup". */
export const AUTH_FILE = path.join(__dirname, '..', 'playwright', '.auth', 'user.json');
