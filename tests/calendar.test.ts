import { describe, it, expect } from 'vitest'
import { calendarForPlant, plantSowableThisMonth } from '@/data/calendar'

describe('calendarForPlant', () => {
  it('devolve apenas entradas da planta pedida', () => {
    const entries = calendarForPlant('alface', 'litoral_norte')
    expect(entries.length).toBeGreaterThan(0)
    expect(entries.every((e) => e.plant === 'alface')).toBe(true)
  })

  it('zona desconhecida cai em delta 0 (= litoral_norte)', () => {
    const norte = calendarForPlant('tomate', 'litoral_norte')
    const desconhecida = calendarForPlant('tomate', 'zona_xpto')
    expect(desconhecida.map((e) => e.months)).toEqual(norte.map((e) => e.months))
  })

  it('desloca as sementeiras por zona, mas não as colheitas', () => {
    const norte = calendarForPlant('tomate', 'litoral_norte')
    const interior = calendarForPlant('tomate', 'interior_norte')
    const semNorte = norte.find((e) => e.action === 'sementeira_interior')!
    const semInterior = interior.find((e) => e.action === 'sementeira_interior')!
    // interior_norte = +1 mês nas sementeiras
    expect(semInterior.months).toEqual(semNorte.months.map((m) => (m % 12) + 1))
  })
})

describe('calendarFor — desfasamento de zona', () => {
  it('litoral_sul antecipa as sementeiras em 1 mês', () => {
    const norte = calendarForPlant('tomate', 'litoral_norte').find((e) => e.action === 'sementeira_interior')!
    const sul = calendarForPlant('tomate', 'litoral_sul').find((e) => e.action === 'sementeira_interior')!
    // -1 mês (com wrap de 12 meses)
    expect(sul.months).toEqual(norte.months.map((m) => ((m - 2 + 12) % 12) + 1))
  })
})

describe('plantSowableThisMonth', () => {
  it('inclui culturas com sementeira no mês (março: alface, rúcula)', () => {
    const set = plantSowableThisMonth('litoral_norte', 3)
    expect(set instanceof Set).toBe(true)
    expect(set.has('alface')).toBe(true)
    expect(set.has('rucula')).toBe(true)
  })

  it('não inclui culturas fora de época de sementeira', () => {
    // alho semeia-se em out/nov; não em maio
    const maio = plantSowableThisMonth('litoral_norte', 5)
    expect(maio.has('alho')).toBe(false)
  })
})
