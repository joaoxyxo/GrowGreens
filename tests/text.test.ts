import { describe, it, expect } from 'vitest'
import { normalize } from '@/utils/text'

describe('normalize (pesquisa tolerante a acentos)', () => {
  it('passa a minúsculas', () => {
    expect(normalize('ALFACE')).toBe('alface')
    expect(normalize('Tomate')).toBe('tomate')
  })

  it('remove acentos e diacríticos', () => {
    expect(normalize('feijão')).toBe('feijao')
    expect(normalize('coentros à António')).toBe('coentros a antonio')
    expect(normalize('Brócolos')).toBe('brocolos')
    expect(normalize('cebolinho-chinês')).toBe('cebolinho-chines')
  })

  it('é idempotente (normalizar já normalizado não muda)', () => {
    const once = normalize('Manjericão')
    expect(normalize(once)).toBe(once)
  })

  it('permite encontrar termos com e sem acento', () => {
    const haystack = normalize('Chicória (almeirão)')
    expect(haystack.includes(normalize('chicoria'))).toBe(true)
    expect(haystack.includes(normalize('almeirao'))).toBe(true)
  })
})
