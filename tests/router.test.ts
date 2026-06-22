import { describe, it, expect } from 'vitest'
import { router } from '@/router'

// Testes determinísticos sobre a configuração do router (sem navegação, que
// dependeria do singleton + pinia ativa e seria flaky). O comportamento do
// guard de onboarding e dos títulos em runtime é exercido pelos testes E2E.
describe('router — configuração', () => {
  it('todas as rotas nomeadas têm meta.title não vazio', () => {
    const named = router.getRoutes().filter((r) => r.name)
    expect(named.length).toBeGreaterThan(10)
    for (const r of named) {
      expect(typeof r.meta.title, `${String(r.name)} sem meta.title`).toBe('string')
      expect((r.meta.title as string).length, `${String(r.name)} meta.title vazio`).toBeGreaterThan(0)
    }
  })

  it('a rota de onboarding permite acesso anónimo', () => {
    const onboarding = router.getRoutes().find((r) => r.name === 'onboarding')
    expect(onboarding?.meta.allowAnon).toBe(true)
  })

  it('rotas de fluxo focado escondem a tab bar (onboarding, lição, revisão)', () => {
    for (const name of ['onboarding', 'lesson', 'review']) {
      const r = router.getRoutes().find((x) => x.name === name)
      expect(r?.meta.hideTabBar, `${name} devia esconder a tab bar`).toBe(true)
    }
  })
})
