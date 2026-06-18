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
