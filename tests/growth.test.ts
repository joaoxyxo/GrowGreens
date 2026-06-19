import { describe, it, expect } from 'vitest'
import { estimateStage, successionDays } from '@/utils/growth'
import type { Plant } from '@/types/catalog'

const fakePlant = (): Plant =>
  ({
    stages: [
      { stage: 'germinacao', durationDays: [5, 10], text: '' },
      { stage: 'plantula', durationDays: [10, 20], text: '' },
      { stage: 'vegetativo', durationDays: [20, 40], text: '' },
      { stage: 'colheita', text: '' },
    ],
  }) as unknown as Plant

describe('estimateStage', () => {
  const p = fakePlant()

  it('arranca na germinação', () => {
    expect(estimateStage(p, 3).index).toBe(0)
    expect(estimateStage(p, 3).label).toBe('Germinação')
  })

  it('avança para plântula e crescimento conforme os dias', () => {
    expect(estimateStage(p, 25).index).toBe(1) // acc germ=10, plântula=30 → 25<=30
    expect(estimateStage(p, 35).index).toBe(2) // vegetativo (acc=70)
  })

  it('além de todas as durações fica na última fase (colheita)', () => {
    const r = estimateStage(p, 500)
    expect(r.index).toBe(3)
    expect(r.total).toBe(4)
  })
})

describe('successionDays', () => {
  it('devolve intervalo para culturas de corte rápidas', () => {
    expect(successionDays('alface')).toBe(14)
    expect(successionDays('rabanete')).toBe(10)
  })

  it('devolve null para culturas que não se semeiam em sucessão', () => {
    expect(successionDays('tomate')).toBeNull()
    expect(successionDays('inexistente')).toBeNull()
  })
})
