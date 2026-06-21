import { test, expect, type Page } from '@playwright/test'

async function completeOnboarding(page: Page) {
  await page.goto('/')
  await expect(page.getByText('Bem-vindo à GrowGreens')).toBeVisible()
  await page.getByRole('button', { name: 'Começar' }).click()
  await page.getByText('Comer mais saudável').click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByText('Varanda', { exact: true }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByText('Nunca cultivei nada').click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByText('Litoral Norte (Ovar/Aveiro)').click()
  await page.getByRole('button', { name: /Iniciar o desafio/ }).click()
  await expect(page.getByText('Desafio Microgreens')).toBeVisible()
}

test('perfil: exportar dados gera um backup JSON', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('link', { name: /Perfil/ }).click()
  await expect(page).toHaveURL(/\/perfil/)

  const downloadPromise = page.waitForEvent('download')
  await page.getByText(/Exportar os meus dados/).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/growgreens-backup\.json/)
})

test('planeador: criar canteiro e plantar uma célula', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('link', { name: /Horta/ }).click()
  await page.getByRole('link', { name: /Plano da horta/ }).click()
  await expect(page).toHaveURL(/\/jardim\/plano/)

  // Cria o primeiro espaço.
  await page.getByRole('button', { name: /Criar o primeiro espaço|Espaço/ }).first().click()
  await page.getByRole('button', { name: 'Criar', exact: true }).click()
  await expect(page).toHaveURL(/\/jardim\/plano\/.+/)

  // Planta na primeira célula vazia.
  await page.getByRole('button', { name: /Célula vazia/ }).first().click()
  await page.getByRole('button', { name: 'Escolher planta' }).click()
  await page.getByPlaceholder(/Procurar planta/).fill('alface')
  await page.getByRole('button', { name: /Alface/ }).first().click()

  // A célula passa a ter a planta (aria-label muda para o nome).
  await expect(page.getByRole('button', { name: /Alface \(linha/ }).first()).toBeVisible()
})
