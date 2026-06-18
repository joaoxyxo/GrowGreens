import { describe, it, expect } from 'vitest'
import { defaultWateringDays } from '@/utils/growth'

describe('defaultWateringDays — necessidade hídrica → dias entre regas', () => {
  it('mapeia cada nível conhecido', () => {
    expect(defaultWateringDays('baixa')).toBe(5)
    expect(defaultWateringDays('moderada')).toBe(3)
    expect(defaultWateringDays('alta')).toBe(2)
  })

  it('quanto maior a necessidade, menor o intervalo', () => {
    expect(defaultWateringDays('alta')).toBeLessThan(defaultWateringDays('moderada'))
    expect(defaultWateringDays('moderada')).toBeLessThan(defaultWateringDays('baixa'))
  })

  it('cai num default seguro para valor inesperado', () => {
    // @ts-expect-error — valor fora do tipo, para garantir o fallback
    expect(defaultWateringDays('desconhecida')).toBe(3)
  })
})
