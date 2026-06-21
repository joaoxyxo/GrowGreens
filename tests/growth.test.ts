import { describe, it, expect } from 'vitest'
import { estimateStage, successionDays, defaultWateringDays } from '@/utils/growth'
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

  it('daysOld negativo não recua a fase (clamp a 0)', () => {
    expect(estimateStage(p, -5).index).toBe(0)
  })

  it('não rebenta com fases sem durationDays (devolve fase válida)', () => {
    const semDuracao = {
      stages: [
        { stage: 'germinacao', text: '' },
        { stage: 'colheita', text: '' },
      ],
    } as unknown as Plant
    const r = estimateStage(semDuracao, 999)
    expect(r.index).toBeGreaterThanOrEqual(0)
    expect(r.index).toBeLessThan(r.total)
    expect(r.label).toBeTruthy()
  })

  it('total corresponde ao número de fases da planta', () => {
    expect(estimateStage(p, 3).total).toBe(p.stages.length)
    expect(estimateStage(p, 999).total).toBe(p.stages.length)
  })
})

describe('defaultWateringDays', () => {
  it('mapeia a necessidade hídrica para dias entre regas', () => {
    expect(defaultWateringDays('baixa')).toBe(5)
    expect(defaultWateringDays('moderada')).toBe(3)
    expect(defaultWateringDays('alta')).toBe(2)
  })

  it('quanto maior a necessidade, menor o intervalo', () => {
    expect(defaultWateringDays('alta')).toBeLessThan(defaultWateringDays('moderada'))
    expect(defaultWateringDays('moderada')).toBeLessThan(defaultWateringDays('baixa'))
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
