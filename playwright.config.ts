import { defineConfig } from '@playwright/test';

const STORAGE = 'tests/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  workers: 2,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://frotamais.expostacker.com.br',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    channel: 'chrome',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'desktop',
      dependencies: ['setup'],
      use: { viewport: { width: 1440, height: 900 }, storageState: STORAGE },
    },
    {
      name: 'mobile',
      dependencies: ['setup'],
      use: { viewport: { width: 390, height: 844 }, storageState: STORAGE },
    },
  ],
});
