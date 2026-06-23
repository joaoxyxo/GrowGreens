import { test, expect } from '@playwright/test'
import { completeOnboarding, openFromProfile } from './helpers'

test('diagnóstico: escolher um sintoma mostra o que fazer', async ({ page }) => {
  await completeOnboarding(page)
  await openFromProfile(page, /A minha planta não está bem/)
  await expect(page).toHaveURL(/\/diagnostico/)
  await expect(page.getByText('Ou procura na lista de sintomas')).toBeVisible()

  // Abre o primeiro sintoma e confirma que aparece o diagnóstico e os passos.
  await page.getByRole('button', { name: /Folhas a ficar amarelas/ }).click()
  await expect(page.getByText(/Provavelmente:/).first()).toBeVisible()
})

test('diagnóstico guiado: chave dicotómica chega a uma causa', async ({ page }) => {
  await completeOnboarding(page)
  await openFromProfile(page, /A minha planta não está bem/)
  await expect(page.getByText('🔑 Diagnóstico guiado')).toBeVisible()

  // Nas folhas → amarelas → entre nervuras (clorose) → resultado com "o que fazer".
  await page.getByRole('button', { name: /Nas folhas/ }).click()
  await page.getByRole('button', { name: /Estão amarelas/ }).click()
  await page.getByRole('button', { name: /entre as nervuras/ }).click()
  await expect(page.getByText(/Provavelmente:/).first()).toBeVisible()
  // Permite recomeçar.
  await page.getByRole('button', { name: 'Recomeçar' }).click()
  await expect(page.getByText('Onde notas o problema?')).toBeVisible()
})

test('glossário: a pesquisa filtra os termos', async ({ page }) => {
  await completeOnboarding(page)
  await openFromProfile(page, /Glossário/)
  await expect(page).toHaveURL(/\/glossario/)
  await expect(page.getByPlaceholder(/Procurar palavra/)).toBeVisible()

  await page.getByPlaceholder(/Procurar palavra/).fill('substrato')
  await expect(page.getByText('Substrato', { exact: true })).toBeVisible()
  // Um termo não relacionado não deve aparecer.
  await expect(page.getByText('Vernalização', { exact: true })).toHaveCount(0)
})
