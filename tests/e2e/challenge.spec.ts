import { test, expect } from '@playwright/test'

// Fluxo crítico: onboarding → iniciar desafio dos microgreens → marcar Dia 0.
test('onboarding e início do desafio dos microgreens', async ({ page }) => {
  await page.goto('/')

  // Onboarding
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

  // Hub do desafio
  await expect(page.getByText('Desafio Microgreens')).toBeVisible()
  await page.getByRole('button', { name: /Começar o desafio/ }).click()

  // Dia 0 marcável
  await expect(page.getByText('Dia 0 de 7')).toBeVisible()
})

// "Saltar" no onboarding leva direto à homepage, sem percorrer os passos.
test('saltar o onboarding vai direto para a homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Bem-vindo à GrowGreens')).toBeVisible()

  await page.getByRole('button', { name: /Saltar/ }).click()

  // Fica na homepage (não no onboarding) e a barra de navegação aparece.
  await expect(page).toHaveURL(/\/$|\/$/)
  await expect(page.getByText('Bem-vindo à GrowGreens')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Início|Horta|Curso/ }).first()).toBeVisible()
})
