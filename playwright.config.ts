import { defineConfig, devices } from '@playwright/test';
import { env } from './fixtures/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // No CI cada job gera um "blob"; o job "report" junta tudo em um único relatório HTML.
  reporter: isCI
    ? [['github'], ['blob']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    // O saucedemo usa o atributo data-test (e não data-testid) nos elementos.
    testIdAttribute: 'data-test',
    // No CI grava trace e vídeo de todos os testes (evidências para o portfólio).
    trace: isCI ? 'on' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isCI ? 'on' : 'retain-on-failure',
    // Câmera lenta opcional: $env:SLOWMO=800 (PowerShell)
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    {
      // Faz login via UI uma única vez e salva a sessão (storageState).
      name: 'setup',
      testDir: './tests/e2e',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      name: 'web',
      testDir: './tests/web',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
    {
      // Testes de API não precisam de browser.
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
  ],
});