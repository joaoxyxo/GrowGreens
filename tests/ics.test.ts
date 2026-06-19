import { describe, it, expect } from 'vitest'
import { buildICS } from '@/utils/ics'
import type { Reminder } from '@/types/models'

const reminder = (over: Partial<Reminder>): Reminder => ({
  id: 'r1',
  plantingId: 'p1',
  type: 'rega',
  label: 'Regar Alface',
  dueAt: '2026-06-20T00:00:00.000Z',
  done: false,
  createdAt: '2026-06-18T00:00:00.000Z',
  ...over,
})

const STAMP = new Date('2026-06-18T09:30:00.000Z')

describe('buildICS', () => {
  it('produz um VCALENDAR com VEVENT bem formado', () => {
    const ics = buildICS([reminder({})], STAMP)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('UID:r1@growgreens')
    expect(ics).toContain('DTSTART;VALUE=DATE:20260620')
  })

  it('inclui DTSTAMP (campo obrigatório) em UTC', () => {
    const ics = buildICS([reminder({})], STAMP)
    expect(ics).toContain('DTSTAMP:20260618T093000Z')
  })

  it('usa RRULE para lembretes recorrentes', () => {
    const ics = buildICS([reminder({ recurrenceDays: 3 })], STAMP)
    expect(ics).toContain('RRULE:FREQ=DAILY;INTERVAL=3')
  })

  it('omite lembretes concluídos', () => {
    const ics = buildICS([reminder({ done: true })], STAMP)
    expect(ics).not.toContain('BEGIN:VEVENT')
  })

  it('escapa vírgulas e ponto-e-vírgula no SUMMARY (RFC 5545)', () => {
    const ics = buildICS([reminder({ label: 'Regar alface, tomate; já' })], STAMP)
    expect(ics).toContain('SUMMARY:🌱 Regar alface\\, tomate\\; já')
  })

  it('tem o mesmo número de BEGIN e END de VEVENT', () => {
    const ics = buildICS([reminder({ id: 'a' }), reminder({ id: 'b' })], STAMP)
    const begins = ics.match(/BEGIN:VEVENT/g)?.length ?? 0
    const ends = ics.match(/END:VEVENT/g)?.length ?? 0
    expect(begins).toBe(2)
    expect(ends).toBe(2)
  })
})
