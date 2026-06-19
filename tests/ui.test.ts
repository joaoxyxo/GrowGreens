import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUiStore } from '@/stores/ui'

describe('ui store — toasts', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('toast adiciona com id único e kind', () => {
    const ui = useUiStore()
    ui.toast('Olá', 'info')
    ui.toast('Mundo')
    expect(ui.toasts).toHaveLength(2)
    expect(ui.toasts[0].message).toBe('Olá')
    expect(ui.toasts[0].kind).toBe('info')
    expect(ui.toasts[1].kind).toBe('success') // default
    expect(ui.toasts[0].id).not.toBe(ui.toasts[1].id)
  })

  it('dismiss remove o toast pelo id', () => {
    const ui = useUiStore()
    ui.toast('A')
    const id = ui.toasts[0].id
    ui.dismiss(id)
    expect(ui.toasts).toHaveLength(0)
  })

  it('limita os toasts visíveis a 3 (descarta os mais antigos)', () => {
    const ui = useUiStore()
    for (let i = 0; i < 6; i++) ui.toast(`t${i}`)
    expect(ui.toasts).toHaveLength(3)
    // ficam os 3 mais recentes
    expect(ui.toasts.map((t) => t.message)).toEqual(['t3', 't4', 't5'])
  })
})
