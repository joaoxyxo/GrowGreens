import { describe, it, expect } from 'vitest'
import { applyActivity, type StreakState } from '@/utils/streak'

const base = (over: Partial<StreakState> = {}): StreakState => ({
  streak: 0,
  lastActiveDay: '',
  freezes: 1,
  freezeRefillAt: '',
  ...over,
})

describe('applyActivity — sequência (streak) com proteção (freeze)', () => {
  it('primeira atividade arranca a sequência em 1', () => {
    const r = applyActivity(base({ streak: 0 }), '2026-06-18')
    expect(r.streak).toBe(1)
    expect(r.lastActiveDay).toBe('2026-06-18')
  })

  it('atividade no mesmo dia não altera a sequência', () => {
    const r = applyActivity(base({ streak: 4, lastActiveDay: '2026-06-18' }), '2026-06-18')
    expect(r.streak).toBe(4)
  })

  it('dias consecutivos incrementam a sequência', () => {
    const r = applyActivity(base({ streak: 4, lastActiveDay: '2026-06-17' }), '2026-06-18')
    expect(r.streak).toBe(5)
  })

  it('falta de 1 dia com freeze disponível consome o freeze e mantém a sequência', () => {
    const r = applyActivity(base({ streak: 4, lastActiveDay: '2026-06-16', freezes: 1 }), '2026-06-18')
    expect(r.streak).toBe(5)
    expect(r.freezes).toBe(0)
    expect(r.freezeRefillAt).toBe('2026-06-25') // +7 dias
  })

  it('falta de 1 dia sem freeze reinicia a sequência', () => {
    const r = applyActivity(base({ streak: 4, lastActiveDay: '2026-06-16', freezes: 0 }), '2026-06-18')
    expect(r.streak).toBe(1)
  })

  it('falha de vários dias reinicia a sequência', () => {
    const r = applyActivity(base({ streak: 9, lastActiveDay: '2026-06-10', freezes: 1 }), '2026-06-18')
    expect(r.streak).toBe(1)
  })

  it('repõe o freeze quando a data de reposição chega', () => {
    const r = applyActivity(
      base({ streak: 3, lastActiveDay: '2026-06-17', freezes: 0, freezeRefillAt: '2026-06-18' }),
      '2026-06-18',
    )
    expect(r.freezes).toBe(1)
    expect(r.freezeRefillAt).toBe('')
  })
})
