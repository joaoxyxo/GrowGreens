import { test, expect } from '@playwright/test'
import { completeOnboarding } from './helpers'

test('calendário: navegar entre meses', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('link', { name: /Calendário/ }).click()
  await expect(page).toHaveURL(/\/calendario/)

  const monthLabel = page.locator('h2.font-display').first()
  const before = await monthLabel.textContent()
  await page.getByRole('button', { name: 'Mês seguinte' }).click()
  await expect(monthLabel).not.toHaveText(before ?? '')
  // Voltar ao mês inicial
  await page.getByRole('button', { name: 'Mês anterior' }).click()
  await expect(monthLabel).toHaveText(before ?? '')
})

test('curso: abrir e concluir uma lição', async ({ page }) => {
  await completeOnboarding(page)
  await page.getByRole('link', { name: /Curso/ }).click()
  await expect(page).toHaveURL(/\/curso/)

  // Abre a primeira lição da lista (link para /curso/licao/...).
  await page.locator('a[href*="/curso/licao/"]').first().click()
  await expect(page).toHaveURL(/\/curso\/licao\//)

  // Percorre os passos até "Concluir" (passos de escolha/ordenar precisam de seleção + Verificar).
  for (let i = 0; i < 15; i++) {
    const verificar = page.getByRole('button', { name: 'Verificar' })
    if (await verificar.isVisible().catch(() => false)) {
      // Seleciona opção(ões) no grid do passo até o "Verificar" ficar ativo.
      const opts = page.locator('main .grid button')
      const n = await opts.count()
      for (let k = 0; k < n && !(await verificar.isEnabled().catch(() => false)); k++) {
        await opts.nth(k).click().catch(() => {})
      }
      await verificar.click().catch(() => {})
    }
    const next = page.getByRole('button', { name: /^(Continuar|Concluir)$/ })
    await expect(next).toBeEnabled()
    const label = (await next.textContent())?.trim()
    await next.click()
    if (label === 'Concluir') break
  }
  // Ecrã de conclusão da lição → "Continuar" volta ao curso.
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page).toHaveURL(/\/curso$/)
})
