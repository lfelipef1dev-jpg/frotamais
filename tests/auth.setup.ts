import { test as setup, expect } from '@playwright/test';

const STORAGE = 'tests/.auth/user.json';

setup('autentica conta de demonstração', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByRole('button', { name: /conta de demonstração/i }).click();
  await page.waitForURL('**/app/dashboard', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: /visão geral/i })).toBeVisible({ timeout: 20000 });
  await page.context().storageState({ path: STORAGE });
});
