import { describe, it, expect } from 'vitest'
import { computeUnlockedDay, challengeDayState } from '@/utils/challenge'

describe('computeUnlockedDay — desbloqueio por tempo OU por progresso', () => {
  it('no arranque (dia 0, nada feito) desbloqueia o dia 0', () => {
    expect(computeUnlockedDay(0, [])).toBe(0)
  })

  it('concluir um passo desbloqueia o dia seguinte mesmo sem passar tempo', () => {
    expect(computeUnlockedDay(0, [0])).toBe(1)
    expect(computeUnlockedDay(0, [0, 1, 2])).toBe(3)
  })

  it('o calendário também desbloqueia sem concluir passos', () => {
    expect(computeUnlockedDay(3, [])).toBe(3)
  })

  it('usa o maior entre tempo e progresso', () => {
    expect(computeUnlockedDay(2, [0, 1, 2, 3])).toBe(4)
    expect(computeUnlockedDay(5, [0])).toBe(5)
  })

  it('nunca passa do dia 7', () => {
    expect(computeUnlockedDay(99, [])).toBe(7)
    expect(computeUnlockedDay(0, [7])).toBe(7)
  })
})

describe('challengeDayState', () => {
  it('dia concluído fica done', () => {
    expect(challengeDayState(0, 2, [0, 1])).toBe('done')
  })

  it('dia abaixo do desbloqueado e não concluído fica available', () => {
    expect(challengeDayState(1, 3, [0])).toBe('available')
  })

  it('o dia desbloqueado é o "today"', () => {
    expect(challengeDayState(3, 3, [0, 1, 2])).toBe('today')
  })

  it('dias acima do desbloqueado ficam locked', () => {
    expect(challengeDayState(5, 3, [])).toBe('locked')
  })

  it('dia 7 concluído (desafio terminado) fica done', () => {
    expect(challengeDayState(7, 7, [0, 1, 2, 3, 4, 5, 6, 7])).toBe('done')
  })
})
