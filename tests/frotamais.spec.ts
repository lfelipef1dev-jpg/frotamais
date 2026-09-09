import { test, expect, type Page } from '@playwright/test';

const BREAKPOINTS = [360, 375, 390, 430, 768, 1024, 1366, 1440, 1920];

test.describe('Landing pública', () => {
  test('carrega sem overflow e sem erros de console', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /visibilidade total/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /acessar demo/i }).first()).toBeVisible();
    expect(errors).toEqual([]);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    );
    expect(overflow).toBe(false);
  });

  for (const w of BREAKPOINTS) {
    test(`sem overflow horizontal em ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      );
      expect(overflow, `overflow em ${w}px`).toBe(false);
    });
  }

  test('SEO: canonical, OG e descrição presentes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /frotamais/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /frota/i);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  });
});

test.describe('Autenticação demo', () => {
  test('login com credenciais inválidas mostra erro', async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('#email', 'naoexiste@demo.com');
    await page.fill('#password', 'senhaerrada123');
    await page.getByRole('button', { name: /entrar no painel/i }).click();
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 15000 });
  });
});

async function gotoModule(page: Page, path: string) {
  // Sessão autenticada via storageState do setup
  await page.goto(path);
}

const MODULES = [
  { path: '/app/dashboard', heading: /visão geral|dashboard/i },
  { path: '/app/vehicles', heading: /veículos/i },
  { path: '/app/drivers', heading: /motoristas/i },
  { path: '/app/routes', heading: /roteirização|rotas/i },
  { path: '/app/fuel', heading: /combustível/i },
  { path: '/app/maintenance', heading: /manutenção/i },
  { path: '/app/alerts', heading: /alertas/i },
  { path: '/app/inspections', heading: /inspeções/i },
  { path: '/app/geofences', heading: /geofences|áreas de controle/i },
  { path: '/app/reports', heading: /relatórios/i },
  { path: '/app/users', heading: /usuários|gestão/i },
];

test.describe('Módulos autenticados', () => {
  for (const m of MODULES) {
    test(`${m.path} carrega sem overflow`, async ({ page }) => {
      await gotoModule(page, m.path);
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: m.heading }).first()).toBeVisible({ timeout: 15000 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      );
      expect(overflow).toBe(false);
    });
  }
});

test.describe('CRUD de veículos', () => {
  test('criar, buscar, editar e excluir veículo', async ({ page }) => {
    test.slow();
    await gotoModule(page, '/app/vehicles');
    const plate = `TST-${Math.floor(Math.random() * 9000 + 1000)}`;

    // Criar
    await page.getByRole('button', { name: /adicionar veículo/i }).click();
    await page.fill('#plate', plate);
    await page.fill('#make', 'TestMarca');
    await page.fill('#model', 'ModeloTest');
    await page.selectOption('#type', 'truck');
    await page.selectOption('#fuelType', 'diesel');
    await page.selectOption('#status', 'available');
    await page.getByRole('button', { name: 'Salvar', exact: true }).click();
    await expect(page.getByText(plate)).toBeVisible({ timeout: 15000 });

    // Buscar
    await page.fill('input[placeholder*="Buscar"]', plate);
    await page.waitForTimeout(500);
    await expect(page.locator('tbody tr')).toHaveCount(1);

    // Editar
    await page.getByRole('button', { name: new RegExp(`Editar ${plate}`) }).click();
    await page.fill('#model', 'ModeloEditado');
    await page.getByRole('button', { name: /salvar alterações/i }).click();
    await page.fill('input[placeholder*="Buscar"]', plate);
    await expect(page.getByText('ModeloEditado')).toBeVisible({ timeout: 15000 });

    // Excluir
    await page.getByRole('button', { name: new RegExp(`Remover ${plate}`) }).click();
    await page.getByRole('button', { name: 'Remover', exact: true }).last().click();
    await page.fill('input[placeholder*="Buscar"]', plate);
    await page.waitForTimeout(800);
    await expect(page.getByText(plate)).toHaveCount(0);
  });
});

test.describe('Acessibilidade', () => {
  test('modal fecha com Escape e tem role=dialog', async ({ page }) => {
    await gotoModule(page, '/app/vehicles');
    await page.getByRole('button', { name: /adicionar veículo/i }).click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('skip link presente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a.skip-link, a[href="#conteudo"]').first()).toBeAttached();
  });
});
