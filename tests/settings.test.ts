import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore, sanitizeZone } from '@/stores/settings'
import { CLIMATE_ZONES } from '@/data/calendar'
import { getMeta } from '@/lib/db/meta'

describe('settings — load e tema', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('load() aplica defaults, marca loaded e não rebenta com applyTheme', async () => {
    const settings = useSettingsStore()
    expect(settings.loaded).toBe(false)
    await settings.load()
    expect(settings.loaded).toBe(true)
    expect(settings.state.zoneCode).toBe('litoral_norte') // default
    expect(settings.state.onboardingComplete).toBe(false)
    // applyTheme usa document/matchMedia (polyfill em setup) — não deve lançar
    expect(() => settings.applyTheme()).not.toThrow()
  })

  it('alterna o tema entre dark e light aplicando a classe no documento', () => {
    const settings = useSettingsStore()
    settings.state.theme = 'dark'
    settings.applyTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    settings.state.theme = 'light'
    settings.applyTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persiste o estado (objeto simples, sem proxy reativo) em meta após load', async () => {
    const settings = useSettingsStore()
    await settings.load()
    settings.state.profileName = 'Maria'
    // O watch persiste via setMeta; não deve lançar DataCloneError (proxy → objeto simples).
    await vi.waitFor(async () => {
      const saved = await getMeta<{ profileName?: string }>('settings', {})
      expect(saved.profileName).toBe('Maria')
    })
  })
})

describe('settings — validação de zona', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sanitizeZone aceita zonas conhecidas', () => {
    for (const z of CLIMATE_ZONES) {
      expect(sanitizeZone(z.code)).toBe(z.code)
    }
  })

  it('sanitizeZone cai no default para zona inválida/vazia', () => {
    expect(sanitizeZone('zona_inexistente')).toBe('litoral_norte')
    expect(sanitizeZone('')).toBe('litoral_norte')
    expect(sanitizeZone(undefined)).toBe('litoral_norte')
  })

  it('completeOnboarding rejeita zona inválida e usa o default', () => {
    const settings = useSettingsStore()
    settings.completeOnboarding({ profileName: 'Teste', zoneCode: 'invalida' })
    expect(settings.state.zoneCode).toBe('litoral_norte')
    expect(settings.state.onboardingComplete).toBe(true)
  })

  it('completeOnboarding mantém uma zona válida', () => {
    const settings = useSettingsStore()
    settings.completeOnboarding({ zoneCode: 'litoral_sul' })
    expect(settings.state.zoneCode).toBe('litoral_sul')
  })
})
