import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProgressStore } from '@/stores/progress'
import { achievementToast, ACHIEVEMENTS } from '@/data/achievements'

describe('progress — lições e XP', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('completar uma lição soma XP uma única vez (idempotente)', () => {
    const p = useProgressStore()
    expect(p.completeLesson('l1-1', 15)).toBe(true)
    expect(p.state.xp).toBe(15)
    // repetir a MESMA lição não soma XP nem duplica o registo
    expect(p.completeLesson('l1-1', 15)).toBe(false)
    expect(p.state.xp).toBe(15)
    expect(p.state.completedLessons.filter((l) => l === 'l1-1')).toHaveLength(1)
  })

  it('lições diferentes acumulam XP e registo', () => {
    const p = useProgressStore()
    p.completeLesson('l1-1', 15)
    p.completeLesson('l1-2', 20)
    expect(p.state.xp).toBe(35)
    expect(p.state.completedLessons).toHaveLength(2)
  })

  it('addXp acumula e o nível sobe com o XP', () => {
    const p = useProgressStore()
    expect(p.level.min).toBe(0)
    p.addXp(200)
    expect(p.state.xp).toBe(200)
    expect(p.level.min).toBeGreaterThan(0) // subiu de nível
  })

  it('achievementToast usa a definição; fallback para código desconhecido', () => {
    expect(achievementToast('semeador')).toContain('Semeador')
    expect(achievementToast('codigo_zzz')).toContain('Conquista')
  })

  it('achievementToast devolve string não vazia para todos os códigos definidos', () => {
    for (const a of ACHIEVEMENTS) {
      const toast = achievementToast(a.code)
      expect(toast.trim().length, a.code).toBeGreaterThan(0)
      expect(toast, a.code).toContain(a.name)
    }
  })

  it('atingir 10 lições satisfaz a condição da conquista "estudioso"', () => {
    const p = useProgressStore()
    for (let i = 0; i < 10; i++) p.completeLesson(`lx-${i}`, 10)
    expect(p.state.completedLessons.length).toBeGreaterThanOrEqual(10)
    expect(p.unlock('estudioso')).toBe(true)
  })
})

describe('progress — conquistas', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('unlock só desbloqueia uma vez e ignora códigos desconhecidos', () => {
    const p = useProgressStore()
    expect(p.unlock('semeador')).toBe(true)
    expect(p.unlock('semeador')).toBe(false) // já desbloqueada
    expect(p.unlock('codigo_inexistente')).toBe(false)
    expect(p.hasAchievement('semeador')).toBe(true)
  })
})
