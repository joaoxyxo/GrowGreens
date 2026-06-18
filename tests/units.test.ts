import { describe, it, expect } from 'vitest'
import { applyActivity } from '@/utils/streak'
import { buildICS } from '@/utils/ics'
import { estimateStage } from '@/utils/growth'
import { calendarFor, plantSowableThisMonth } from '@/data/calendar'
import { getPlant } from '@/data/plants'
import type { Reminder } from '@/types/models'

describe('streak com proteção (freeze)', () => {
  const base = { streak: 3, lastActiveDay: '2026-06-10', freezes: 1, freezeRefillAt: '' }

  it('mesmo dia não altera', () => {
    expect(applyActivity(base, '2026-06-10').streak).toBe(3)
  })
  it('dia seguinte incrementa', () => {
    expect(applyActivity(base, '2026-06-11').streak).toBe(4)
  })
  it('falhar 1 dia consome freeze e mantém a sequência', () => {
    const r = applyActivity(base, '2026-06-12')
    expect(r.streak).toBe(4)
    expect(r.freezes).toBe(0)
  })
  it('falhar 1 dia sem freeze reinicia', () => {
    const r = applyActivity({ ...base, freezes: 0 }, '2026-06-12')
    expect(r.streak).toBe(1)
  })
  it('grande intervalo reinicia', () => {
    expect(applyActivity(base, '2026-06-30').streak).toBe(1)
  })
})

describe('export .ics', () => {
  it('gera um VCALENDAR com eventos pendentes', () => {
    const reminders: Reminder[] = [
      {
        id: 'r1',
        plantingId: 'p1',
        type: 'rega',
        label: 'Regar Alface',
        dueAt: '2026-06-20T00:00:00.000Z',
        done: false,
        recurrenceDays: 3,
        createdAt: '2026-06-17T00:00:00.000Z',
      },
    ]
    const ics = buildICS(reminders)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('SUMMARY:🌱 Regar Alface')
    expect(ics).toContain('RRULE:FREQ=DAILY;INTERVAL=3')
  })
})

describe('fase de crescimento estimada', () => {
  it('avança com os dias', () => {
    const alface = getPlant('alface')!
    const cedo = estimateStage(alface, 1)
    const tarde = estimateStage(alface, 200)
    expect(cedo.index).toBeLessThanOrEqual(tarde.index)
    expect(tarde.index).toBe(tarde.total - 1)
  })
})

describe('calendário por zona (sem zonas vazias)', () => {
  it('o litoral sul também devolve plantas para semear', () => {
    let algumMes = false
    for (let m = 1; m <= 12; m++) {
      if (plantSowableThisMonth('litoral_sul', m).size > 0) algumMes = true
    }
    expect(algumMes).toBe(true)
  })
  it('o interior tem entradas de calendário', () => {
    let total = 0
    for (let m = 1; m <= 12; m++) total += calendarFor('interior_norte', m).length
    expect(total).toBeGreaterThan(0)
  })
})
