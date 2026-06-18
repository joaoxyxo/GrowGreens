import { describe, it, expect } from 'vitest'
import { addDaysISO, daysSince, currentSeason, MONTH_NAMES } from '@/utils/date'

describe('utils/date', () => {
  it('adiciona dias corretamente', () => {
    const base = '2026-06-01T00:00:00.000Z'
    const plus3 = addDaysISO(base, 3)
    expect(plus3.startsWith('2026-06-04')).toBe(true)
  })

  it('calcula dias decorridos (nunca negativo)', () => {
    const future = addDaysISO(new Date(), 5)
    expect(daysSince(future)).toBe(0)
    const past = addDaysISO(new Date(), -5)
    expect(daysSince(past)).toBeGreaterThanOrEqual(5)
  })

  it('devolve uma estação válida', () => {
    expect(['primavera', 'verao', 'outono', 'inverno']).toContain(currentSeason())
  })

  it('tem 12 meses', () => {
    expect(MONTH_NAMES).toHaveLength(12)
    expect(MONTH_NAMES[0]).toBe('Janeiro')
  })
})
