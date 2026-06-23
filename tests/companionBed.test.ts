import { describe, it, expect } from 'vitest'
import { analyzeBed, suggestCompanions } from '@/utils/companionBed'
import { PLANTS, PLANTS_BY_SLUG } from '@/data/plants'
import { areAntagonists, areCompanions } from '@/utils/growth'

const p = (slug: string) => PLANTS_BY_SLUG[slug]

describe('analyzeBed', () => {
  it('deteta uma boa vizinhança (cenoura + cebola)', () => {
    const a = analyzeBed([p('cenoura'), p('cebola')])
    expect(a.synergies.length).toBe(1)
    expect(a.conflicts.length).toBe(0)
    expect(a.score).toBe(1)
  })

  it('deteta um conflito (grão-de-bico + cebola são antagonistas)', () => {
    const a = analyzeBed([p('grao-de-bico'), p('cebola')])
    expect(a.conflicts.length).toBe(1)
    expect(a.score).toBeLessThan(0)
  })

  it('ignora duplicados e canteiros com uma só planta', () => {
    expect(analyzeBed([p('tomate'), p('tomate')]).synergies).toHaveLength(0)
    expect(analyzeBed([p('tomate')]).score).toBe(0)
  })
})

describe('suggestCompanions', () => {
  it('sugere companheiras e nunca antagonistas das presentes', () => {
    const present = [p('cenoura')]
    const sugg = suggestCompanions(present, PLANTS, 5)
    expect(sugg.length).toBeGreaterThan(0)
    for (const s of sugg) {
      // boa companheira de alguma presente
      expect(present.some((x) => areCompanions(s, x))).toBe(true)
      // e antagonista de nenhuma
      expect(present.some((x) => areAntagonists(s, x))).toBe(false)
    }
  })

  it('não sugere plantas já presentes', () => {
    const sugg = suggestCompanions([p('cenoura'), p('cebola')], PLANTS, 8)
    expect(sugg.find((s) => s.slug === 'cenoura' || s.slug === 'cebola')).toBeUndefined()
  })
})
