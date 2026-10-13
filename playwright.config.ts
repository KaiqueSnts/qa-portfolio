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
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    {

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
