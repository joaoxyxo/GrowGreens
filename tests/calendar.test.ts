import { describe, it, expect } from 'vitest'
import { calendarForPlant, plantSowableThisMonth, calendarFor, soilTipForMonth } from '@/data/calendar'

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

  it('é consistente com calendarForPlant: cada planta semeável tem sementeira nesse mês', () => {
    const zone = 'litoral_norte'
    const month = 4
    for (const slug of plantSowableThisMonth(zone, month)) {
      const semeiaNoMes = calendarForPlant(slug, zone).some(
        (e) =>
          (e.action === 'sementeira_direta' || e.action === 'sementeira_interior') &&
          e.months.includes(month),
      )
      expect(semeiaNoMes, `${slug} devia ter sementeira em ${month}`).toBe(true)
    }
  })
})

describe('calendarFor (cache)', () => {
  it('devolve a mesma referência para a mesma zona/mês (cache)', () => {
    const a = calendarFor('litoral_norte', 4)
    const b = calendarFor('litoral_norte', 4)
    expect(a).toBe(b)
  })

  it('devolve referências distintas para meses diferentes', () => {
    expect(calendarFor('litoral_norte', 4)).not.toBe(calendarFor('litoral_norte', 5))
  })
})

describe('soilTipForMonth', () => {
  it('devolve a dica da estação correspondente', () => {
    expect(soilTipForMonth(4)).toMatch(/Primavera/)
    expect(soilTipForMonth(7)).toMatch(/Verão/)
    expect(soilTipForMonth(10)).toMatch(/Outono/)
    expect(soilTipForMonth(1)).toMatch(/Inverno/)
  })
})
