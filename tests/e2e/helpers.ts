import { expect, type Page } from '@playwright/test'

/**
 * Percorre o onboarding até ao hub do desafio. Helper partilhado por todos os
 * specs E2E (antes estava copiado em cada ficheiro).
 */
export async function completeOnboarding(page: Page) {
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

/** Abre um ecrã a partir do Perfil por navegação SPA (evita o guard de onboarding num reload). */
export async function openFromProfile(page: Page, linkName: RegExp) {
  await page.getByRole('link', { name: /Perfil/ }).click()
  await expect(page).toHaveURL(/\/perfil/)
  await page.getByRole('link', { name: linkName }).click()
}
