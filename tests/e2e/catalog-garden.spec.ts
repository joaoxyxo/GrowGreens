import { test, expect } from '@playwright/test'
import { completeOnboarding } from './helpers'

// Navega para o catálogo dentro da SPA (sem reload, para o estado persistir em memória).
async function gotoCatalog(page: Page) {
  await completeOnboarding(page)
  await page.getByRole('link', { name: /Horta/ }).click()
  await expect(page).toHaveURL(/\/jardim/)
  await page.getByRole('link', { name: /Descobrir/ }).click()
  await expect(page).toHaveURL(/\/catalogo/)
}

test('catálogo: a pesquisa filtra as plantas', async ({ page }) => {
  await gotoCatalog(page)

  const search = page.getByPlaceholder(/Procurar planta/)
  await search.fill('tomate')
  await expect(page.getByText('Tomate', { exact: true })).toBeVisible()

  // Uma pesquisa sem correspondência mostra o estado vazio.
  await search.fill('zzzznaoexiste')
  await expect(page.getByText('Sem resultados')).toBeVisible()
})

test('horta: adicionar uma planta e vê-la na horta', async ({ page }) => {
  await gotoCatalog(page)

  await page
    .getByRole('link', { name: /Alface/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/planta\/alface/)
  // O botão fica no fundo, tapado pela TabBar fixa — dispara o handler via DOM.
  await page
    .getByRole('button', { name: /Adicionar à minha horta/ })
    .evaluate((el) => (el as HTMLElement).click())
  // Modal de adicionar (overlay acima da TabBar)
  await expect(page.getByRole('heading', { name: /Adicionar Alface/ })).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar 🌱' }).click()

  // Volta à horta pela navegação e confirma.
  await page.getByRole('link', { name: /Horta/ }).click()
  await expect(page).toHaveURL(/\/jardim/)
  await expect(page.getByText('Alface').first()).toBeVisible()
})
