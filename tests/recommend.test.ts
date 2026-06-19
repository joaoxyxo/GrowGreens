import { describe, it, expect } from 'vitest'
import { recommendPlants } from '@/utils/recommend'
import type { SettingsState } from '@/types/models'

const settings = (over: Partial<SettingsState> = {}): SettingsState => ({
  onboardingComplete: true,
  profileName: '',
  zoneCode: 'litoral_norte',
  goal: '',
  space: 'varanda',
  experience: 'nunca',
  theme: 'system',
  notificationsEnabled: false,
  ...over,
})

describe('recommendPlants', () => {
  it('respeita o limite pedido', () => {
    expect(recommendPlants(settings(), 3)).toHaveLength(3)
    expect(recommendPlants(settings(), 5)).toHaveLength(5)
  })

  it('devolve plantas (objetos do catálogo) com slug', () => {
    const r = recommendPlants(settings(), 3)
    expect(r.every((p) => typeof p.slug === 'string' && p.slug.length > 0)).toBe(true)
  })

  it('só-interior não recomenda plantas exclusivamente de exterior no topo', () => {
    const r = recommendPlants(settings({ space: 'interior' }), 3)
    expect(r.some((p) => p.location === 'exterior')).toBe(false)
  })

  it('é determinístico para os mesmos settings (ordenação estável)', () => {
    const a = recommendPlants(settings(), 5).map((p) => p.slug)
    const b = recommendPlants(settings(), 5).map((p) => p.slug)
    expect(a).toEqual(b)
  })
})
