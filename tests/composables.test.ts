import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { weatherTypeInfo } from '@/composables/useWeather'
import { useOnlineStatus } from '@/composables/useOnlineStatus'
import { useReminders } from '@/composables/useReminders'
import { db } from '@/lib/db/dexie'

/** Aguarda até `predicate` ser verdadeiro ou esgotar o tempo (para liveQuery assíncrono). */
async function waitFor(predicate: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now()
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor: timeout')
    await new Promise((r) => setTimeout(r, 10))
  }
}

describe('weatherTypeInfo', () => {
  it('devolve label/emoji para um tipo conhecido', () => {
    const info = weatherTypeInfo(1)
    expect(info.label).toBe('Céu limpo')
    expect(info.emoji).toBeTruthy()
  })

  it('cai num fallback para tipo desconhecido', () => {
    const info = weatherTypeInfo(9999)
    expect(info.label).toBe('—')
    expect(info.emoji).toBe('🌡️')
  })
})

describe('useOnlineStatus', () => {
  it('expõe o estado online inicial e reage a eventos', async () => {
    const wrapper = mount({
      template: '<span>{{ isOnline }}</span>',
      setup: () => useOnlineStatus(),
    })
    // jsdom arranca online
    expect(typeof wrapper.vm.isOnline).toBe('boolean')
    expect(wrapper.vm.isOnline).toBe(true)

    // simula ficar offline
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
    window.dispatchEvent(new Event('offline'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isOnline).toBe(false)

    // repõe
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
  })
})

describe('useReminders', () => {
  it('devolve sempre a mesma instância (subscrição partilhada)', () => {
    expect(useReminders()).toBe(useReminders())
  })

  it('reflete novos lembretes inseridos na base de dados (reativo)', async () => {
    const reminders = useReminders()
    await db.reminders.clear()
    await waitFor(() => reminders.value.length === 0)

    await db.reminders.add({
      id: 'rem-test-1',
      plantingId: 'p-1',
      type: 'rega',
      label: 'Regar a alface',
      dueAt: '2026-06-20',
      done: false,
      createdAt: '2026-06-18',
    })

    await waitFor(() => reminders.value.some((r) => r.id === 'rem-test-1'))
    expect(reminders.value.find((r) => r.id === 'rem-test-1')?.label).toBe('Regar a alface')

    await db.reminders.clear()
  })
})
