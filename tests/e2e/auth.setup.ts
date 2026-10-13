
import { expect, test as setup } from '@playwright/test';
import { AUTH_FILE } from '../../fixtures/env';
import { USERS } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';

setup('autenticar via UI e salvar sessão', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: AUTH_FILE });
});
