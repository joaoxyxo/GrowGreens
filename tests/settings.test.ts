import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore, sanitizeZone } from '@/stores/settings'
import { CLIMATE_ZONES } from '@/data/calendar'

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
