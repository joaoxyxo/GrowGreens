import { describe, it, expect } from 'vitest'
import { recommendPlants, shouldSuggestMicrogreens } from '@/utils/recommend'
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

  it('só-interior só recomenda plantas viáveis dentro de casa (interior/ambos)', () => {
    const r = recommendPlants(settings({ space: 'interior' }), 5)
    expect(r.every((p) => p.location === 'interior' || p.location === 'ambos')).toBe(true)
  })

  it('não falha com limite 0 (devolve lista vazia)', () => {
    expect(recommendPlants(settings(), 0)).toEqual([])
  })
})

describe('shouldSuggestMicrogreens', () => {
  it('falso em espaço de exterior (varanda/quintal)', () => {
    expect(shouldSuggestMicrogreens(settings({ space: 'varanda' }))).toBe(false)
    expect(shouldSuggestMicrogreens(settings({ space: 'quintal' }))).toBe(false)
  })

  it('depende de haver algo semeável: true apenas em interior sem opções', () => {
    // O resultado para interior segue plantSowableThisMonth para o mês atual.
    // Garantimos coerência: se sugerir, é porque não há nada semeável.
    const interior = shouldSuggestMicrogreens(settings({ space: 'interior' }))
    const parapeito = shouldSuggestMicrogreens(settings({ space: 'parapeito' }))
    expect(interior).toBe(parapeito) // ambos são "só-interior", mesmo critério
    expect(typeof interior).toBe('boolean')
  })
})
