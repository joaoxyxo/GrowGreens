import { describe, it, expect } from 'vitest'
import { wateringAdvice } from '@/composables/useWeather'
import type { DayForecast } from '@/composables/useWeather'

const day = (over: Partial<DayForecast> = {}): DayForecast => ({
  date: '2026-06-19',
  tMin: 14,
  tMax: 22,
  precipProb: 10,
  weatherType: 1,
  ...over,
})

describe('wateringAdvice', () => {
  it('sem previsão → sem conselho', () => {
    expect(wateringAdvice([])).toBeNull()
  })

  it('chuva provável hoje ou amanhã → sugere saltar a rega', () => {
    expect(wateringAdvice([day({ precipProb: 80 })])).toContain('chover')
    expect(wateringAdvice([day(), day({ precipProb: 75 })])).toContain('chover')
  })

  it('dia muito quente → sugere regar de manhã', () => {
    expect(wateringAdvice([day({ tMax: 32 })])).toContain('quente')
  })

  it('dia ameno e seco → sem conselho', () => {
    expect(wateringAdvice([day({ tMax: 22, precipProb: 10 })])).toBeNull()
  })
})
