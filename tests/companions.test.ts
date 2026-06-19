import { describe, it, expect } from 'vitest'
import { areCompanions, areAntagonists } from '@/utils/growth'
import type { Plant } from '@/types/catalog'

const mk = (slug: string, companions: string[] = [], antagonists: string[] = []): Plant =>
  ({ slug, companions, antagonists }) as unknown as Plant

describe('areCompanions / areAntagonists — relação de vizinhança simétrica', () => {
  it('boa vizinhança se A lista B', () => {
    expect(areCompanions(mk('a', ['b']), mk('b'))).toBe(true)
  })

  it('boa vizinhança se B lista A (simétrico)', () => {
    expect(areCompanions(mk('a'), mk('b', ['a']))).toBe(true)
  })

  it('sem relação → não são companheiras', () => {
    expect(areCompanions(mk('a'), mk('b'))).toBe(false)
  })

  it('má vizinhança se qualquer lado lista o outro como antagonista', () => {
    expect(areAntagonists(mk('a', [], ['b']), mk('b'))).toBe(true)
    expect(areAntagonists(mk('a'), mk('b', [], ['a']))).toBe(true)
  })

  it('antagonismo não é confundido com companheirismo', () => {
    const a = mk('a', [], ['b'])
    const b = mk('b')
    expect(areCompanions(a, b)).toBe(false)
    expect(areAntagonists(a, b)).toBe(true)
  })
})
