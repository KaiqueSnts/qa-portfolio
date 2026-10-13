
import { expect, test } from '@playwright/test';
import { USERS } from '../../fixtures/users';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('usuário válido acessa o catálogo', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(new InventoryPage(page).title).toHaveText('Products');
  });

  test('senha incorreta exibe erro', { tag: ['@regression'] }, async () => {
    await loginPage.login(USERS.standard.username, 'senha_errada');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('usuário bloqueado não consegue entrar', { tag: ['@regression'] }, async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('this user has been locked out');
  });

  test('usuário vazio exibe campo obrigatório', { tag: ['@regression'] }, async () => {
    await loginPage.login('', USERS.standard.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('logout retorna para a tela de login', { tag: ['@regression'] }, async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await new InventoryPage(page).logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
